import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/user.dto';
import { LocalAuthGuard, JwtRefreshAuthGuard, GoogleOAuthGuard, GithubOAuthGuard } from './guards';
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
    return this.authService.login(user, res);
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
  async googleCallback(@CurrentUser() user: User, @Res({ passthrough: true }) res: Response) {
    await this.authService.login(user, res); // generate own JWT tokens
    res.redirect(`${this.configService.getOrThrow("CLIENT_URL")}`);
  }

  @UseGuards(GithubOAuthGuard)
  @Get('github')
  loginWithGithub() { }

  @UseGuards(GithubOAuthGuard)
  @Get('github/callback')
  async githubCallback(@CurrentUser() user: User, @Res({ passthrough: true }) res: Response) {
    await this.authService.login(user, res); // generate own JWT tokens
    res.redirect(`${this.configService.getOrThrow("CLIENT_URL")}`);
  }


  @Get('logout')
  @HttpCode(200)
  async logout(@CurrentUser() user: User, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(user, res);
    res.redirect(`${this.configService.getOrThrow("CLIENT_URL")}`);
  }
}
