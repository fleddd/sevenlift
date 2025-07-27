import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
    handleRequest(err: any, user: any, info: any, context: any) {
        if (err || !user) {
            throw err || new UnauthorizedException('Could not authenticate user through google. Please try again or choose other way to authenticate.');
        }
        return user;
    }
}
