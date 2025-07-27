import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { AuthService } from "../auth.service";
import { User } from "generated/prisma";

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(Strategy, "google") {
    constructor(private readonly authService: AuthService, configService: ConfigService) {
        super({
            clientID: configService.getOrThrow("GOOGLE_CLIENT_ID"),
            clientSecret: configService.getOrThrow("GOOGLE_CLIENT_SECRET"),
            callbackURL: configService.getOrThrow("GOOGLE_CALLBACK_URL"),
            scope: ["email", "profile"],

        })
    }
    authorizationParams(): { [key: string]: string; } {
        return ({
            access_type: 'offline',
            prompt: 'consent',

        });
    };

    async validate(accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback) {
        const user = await this.authService.getUserWithUser(profile, refreshToken);
        done(null, user);
    }


}