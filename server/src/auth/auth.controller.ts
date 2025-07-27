import { Body, Controller, HttpCode, Post, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/user.dto';
import { LocalAuthGuard, JwtRefreshAuthGuard } from './guards';
import { CurrentUser } from './decorators/currentUser.decorator';
import { User } from 'generated/prisma';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

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
}
