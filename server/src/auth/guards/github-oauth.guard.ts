import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";

@Injectable()
export class GithubOAuthGuard extends AuthGuard('github') {
    constructor(private readonly configService: ConfigService) {
        super();
    }
    handleRequest(err: any, user: any, info: any, context: any) {
        const res: Response = context.switchToHttp().getResponse();
        const clientUrl = this.configService.getOrThrow("CLIENT_URL");
        if (err) {
            return res.redirect(clientUrl + "/login");
        }

        return user;
    }
}
