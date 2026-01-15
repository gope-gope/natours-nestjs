import { Body, Controller, Patch, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Response, Request } from 'express';
import { UpdateMeDto } from './dto/update-me.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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

  @Patch('/update-my-password')
  async updatePassword(@Req() req: Request, @Body() body: UpdatePasswordDto) {
    const { jwt } = req.cookies;
    return await this.authService.updatePassword(body, jwt);
  }

  @Patch('/update-me')
  async updateMe(@Req() req: Request, @Body() body: UpdateMeDto) {
    const { jwt } = req.cookies;
    return await this.authService.updateMe(body, jwt);
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
