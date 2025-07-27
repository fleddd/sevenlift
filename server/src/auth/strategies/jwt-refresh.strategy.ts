import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { UsersService } from "src/users/users.service";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor(private readonly authService: AuthService, configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.Refresh;
                }
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow("JWT_REFRESH_SECRET"),
            passReqToCallback: true,
        })
    }


    async validate(request: Request, payload: TokenPayload) {
        return await this.authService.verifyRefreshToken(request?.cookies?.Refresh, payload.userId);
    }
}