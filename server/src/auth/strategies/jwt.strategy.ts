import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService, configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.Authentication;
                }
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow("JWT_ACCESS_SECRET"),
        })
    }

    async validate(payload: TokenPayload) {
        return await this.userService.findUserById(payload.userId);
    }
}