export function generateJwtToken(payload: object, secret: string, expiresInMs: number): string {
    return this.jwtService.sign(payload, {
        secret,
        expiresIn: `${expiresInMs}ms`,
    });
}