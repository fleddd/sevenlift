import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-github2";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";

@Injectable()
export class GithubOAuthStrategy extends PassportStrategy(Strategy, "github") {
    constructor(private readonly authService: AuthService, configService: ConfigService) {
        super({
            clientID: configService.getOrThrow("GITHUB_CLIENT_ID"),
            clientSecret: configService.getOrThrow("GITHUB_CLIENT_SECRET"),
            callbackURL: configService.getOrThrow("GITHUB_CALLBACK_URL"),
            scope: ["user:email"],
        })
    }

    async validate(accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback) {
        const email = profile.emails?.[0]?.value;
        const name = profile._json.name;
        const user = await this.authService.getUserWithOAuth(email, name);
        done(null, user);
    }


}