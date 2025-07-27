import { JwtService } from "@nestjs/jwt";

export function generateJwtToken(jwtService: JwtService, payload: object, secret: string, expiresInMs: number): string {
    return jwtService.sign(payload, {
        secret,
        expiresIn: `${expiresInMs}ms`,
    });
}