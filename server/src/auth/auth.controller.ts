import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/user.dto';
import { LocalAuthGuard, JwtRefreshAuthGuard, GoogleOAuthGuard } from './guards';
import { CurrentUser } from './decorators/currentUser.decorator';
import { User } from 'generated/prisma';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) { }

  @Post('register')
  registerUser(@Body() data: RegisterUserDto) {
    return this.authService.registerUser(data.email, data.password, data.name);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  loginUser(@CurrentUser() user: User, @Res({ passthrough: true }) res: Response) {
    console.log('User logged in:', user);
  }

  @HttpCode(200)
  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  refreshToken(@CurrentUser() user: User, @Res({ passthrough: true }) res: Response) {
    return this.authService.refreshAccessToken(user, res);
  }

  @UseGuards(GoogleOAuthGuard)
  @Get('google')
  loginWithGoogle() { }

  @UseGuards(GoogleOAuthGuard)
  @Get('google/callback')
  async googleCallback(@CurrentUser() user: User, @Res({ passthrough: true }) res: Response, @Req() req: Request) {
    await this.authService.login(user, res); // generate own JWT tokens
    res.clearCookie('jwt') // clear the cookie set by Google OAuth
    res.redirect(`${this.configService.getOrThrow("CLIENT_URL")}`);
  }
}
