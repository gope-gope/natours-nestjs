import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() body) {
    return await this.authService.signup(body);
  }

  @Post('/login')
  async login(@Body() body) {
    return await this.authService.login(body);
  }

  @Post('/forgot-password')
  async forgotPassword() {}
}
