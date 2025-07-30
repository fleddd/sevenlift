import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(
		private readonly authService: AuthService,
		configService: ConfigService
	) {
		super({
			clientID: configService.getOrThrow('GOOGLE_CLIENT_ID'),
			clientSecret: configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
			callbackURL: configService.getOrThrow('GOOGLE_CALLBACK_URL'),
			scope: ['email', 'profile']
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		done: VerifyCallback
	) {
		const user = await this.authService.getUserWithOAuth(
			profile._json.email,
			profile._json.name
		);
		done(null, user);
	}
}
