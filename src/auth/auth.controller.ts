import { Body, Controller, Post, Req, Res } from '@nestjs/common';

import { Response, Request } from 'express';

import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() body: SignupDto) {
    return await this.authService.signup(body);
  }

  @Post('/login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(body);

    res.cookie('jwt', token, {
      httpOnly: true,
    });

    return token;
  }

  @Post('/forgot-password')
  async forgotPassword(@Req() req: Request, @Body() body: ForgotPasswordDto) {
    return await this.authService.forgotPassword(body, req);
  }

  @Post('/reset-password/:token')
  async resetPassword(@Req() req: Request, @Body() body: ResetPasswordDto) {
    return await this.authService.resetPassword(body, req);
  }
}
