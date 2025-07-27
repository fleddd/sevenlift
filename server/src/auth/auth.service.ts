import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Provider, User } from 'generated/prisma';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verifyHash } from './utils';
import { Profile } from 'passport-google-oauth20';
import { ref } from 'process';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly configService: ConfigService, private readonly jwtService: JwtService) { }

    async login(user: User, response: Response) {
        const { password, ...userWithPassword } = user;

        const now = Date.now();

        const accessTokenExpiresInMs = parseInt(this.configService.getOrThrow("JWT_ACCESS_EXPIRATION_TIME_MS"));
        const refreshTokenExpiresInMs = parseInt(this.configService.getOrThrow("JWT_REFRESH_EXPIRATION_TIME_MS"));

        const expiresAccessToken = new Date(now + accessTokenExpiresInMs);
        const expiresRefreshToken = new Date(now + refreshTokenExpiresInMs);


        const tokenPayload = {
            userId: user.id
        }

        const accessToken = this.generateJwtToken(
            tokenPayload,
            this.configService.getOrThrow("JWT_ACCESS_SECRET"),
            accessTokenExpiresInMs
        )

        const refreshToken = this.generateJwtToken(
            tokenPayload,
            this.configService.getOrThrow("JWT_REFRESH_SECRET"),
            refreshTokenExpiresInMs,
        )

        response.cookie('Authentication', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: expiresAccessToken,
        })


        response.cookie('Refresh', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: expiresRefreshToken,
        })

        const hashedRefreshToken = await hash(refreshToken);


        await this.usersService.updateUserById(user.id, {
            refreshToken: hashedRefreshToken,
        })


        return {
            ...userWithPassword,
            refreshToken: hashedRefreshToken
        };
    }

    async verifyUser(email: string, password: string) {
        const user = await this.usersService.findUserByEmail(email);
        if (!user) {
            throw new BadRequestException('User not found. This email is not registered.');
        }

        if (!user.password || !user.password.startsWith('$')) {
            throw new BadRequestException('User password is not set or is in an invalid format.');
        }

        const isPasswordValid = await verifyHash(user.password, password);

        if (!isPasswordValid) {
            throw new BadRequestException('Invalid email or password. Please try again.');
        }

        return user;
    }

    async registerUser(email: string, password: string, name: string) {
        const existingUser = await this.usersService.findUserByEmail(email);
        if (existingUser) {
            throw new BadRequestException('Email already registered. Please use a different email.');
        }

        const hashedPassword = await hash(password);

        return this.usersService.createUser(email, hashedPassword, Provider.LOCAL, name);
    }
    async verifyRefreshToken(refreshToken: string, userId: string) {
        const user = await this.usersService.findUserById(userId);

        if (!user || !user.refreshToken) {
            throw new BadRequestException('Invalid refresh token.');
        }

        const isRefreshTokenValid = await verifyHash(user.refreshToken, refreshToken);
        if (!isRefreshTokenValid) {
            throw new UnauthorizedException('Invalid refresh token. You need to log in again.');
        }

        return user;
    }
    async refreshAccessToken(user: User, response: Response) {
        const { password, ...userWithPassword } = user;
        const now = Date.now();
        const accessTokenExpiresInMs = parseInt(this.configService.getOrThrow("JWT_ACCESS_EXPIRATION_TIME_MS"));

        const expiresAccessToken = new Date(now + accessTokenExpiresInMs);

        const tokenPayload = {
            userId: user.id
        }

        const accessToken = this.generateJwtToken(
            tokenPayload,
            this.configService.getOrThrow("JWT_ACCESS_SECRET"),
            accessTokenExpiresInMs
        )

        response.cookie('Authentication', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: expiresAccessToken,
        })



        return userWithPassword;
    }

    async getUserWithUser(userProfile: Profile, refreshToken: string | null = null) {
        const { email, name } = userProfile._json;
        if (!email) {
            throw new BadRequestException('Google account does not have an email associated with it.');
        }
        if (!refreshToken) {
            throw new BadRequestException('Google account does not have a refresh token associated with it.');
        }
        const hashedRefreshToken = await hash(refreshToken);

        const existingUser = await this.usersService.findUserByEmail(email);
        if (!existingUser) {
            return await this.usersService.createUser(email, '', Provider.GOOGLE, name || email, hashedRefreshToken);
        }
        return existingUser;

    }
    private generateJwtToken(payload: object, secret: string, expiresInMs: number): string {
        return this.jwtService.sign(payload, {
            secret,
            expiresIn: `${expiresInMs}ms`,
        });
    }



}
