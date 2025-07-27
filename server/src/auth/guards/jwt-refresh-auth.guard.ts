import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
    handleRequest(err: any, user: any, info: any, context: any) {
        if (err || !user) {
            throw new UnauthorizedException('Authorization token is invalid or has expired. Please log in again.');
        }
        return user;
    }
}
