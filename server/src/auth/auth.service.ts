import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Provider, User } from 'generated/prisma';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import e, { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly configService: ConfigService, private readonly jwtService: JwtService) { }

    async login(user: User, response: Response) {
        const now = Date.now();

        const accessTokenExpiresInMs = parseInt(this.configService.getOrThrow("JWT_ACCESS_EXPIRATION_TIME_MS"));
        const refreshTokenExpiresInMs = parseInt(this.configService.getOrThrow("JWT_REFRESH_EXPIRATION_TIME_MS"));

        const expiresAccessToken = new Date(now + accessTokenExpiresInMs);
        const expiresRefreshToken = new Date(now + refreshTokenExpiresInMs);


        const tokenPayload = {
            userId: user.id
        }

        const accessToken = this.jwtService.sign(
            tokenPayload,
            {
                secret: this.configService.getOrThrow("JWT_ACCESS_SECRET"),
                expiresIn: `${accessTokenExpiresInMs}ms`,
            }
        )
        const refreshToken = this.jwtService.sign(
            tokenPayload,
            {
                secret: this.configService.getOrThrow("JWT_REFRESH_SECRET"),
                expiresIn: `${refreshTokenExpiresInMs}ms`,
            }
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

        await this.usersService.updateUserById(user.id, {
            refreshToken: await argon2.hash(refreshToken),
        })
    }

    async verifyUser(email: string, password: string) {
        const user = await this.usersService.findUserByEmail(email);
        if (!user) {
            throw new BadRequestException('User not found. This email is not registered.');
        }

        const isPasswordValid = await argon2.verify(user.password, password);

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

        const hashedPassword = await this.hashPassword(password);

        return this.usersService.createUser(email, hashedPassword, Provider.LOCAL, name);
    }
    async verifyRefreshToken(refreshToken: string, userId: string) {
        const user = await this.usersService.findUserById(userId);

        if (!user || !user.refreshToken) {
            throw new BadRequestException('Invalid refresh token.');
        }

        const isRefreshTokenValid = await argon2.verify(user.refreshToken, refreshToken);
        if (!isRefreshTokenValid) {
            throw new UnauthorizedException('Invalid refresh token. You need to log in again.');
        }

        return user;
    }


    private async hashPassword(password: string): Promise<string> {
        return await argon2.hash(password)
    }



}
