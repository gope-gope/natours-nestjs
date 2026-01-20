import { IsEmail } from 'class-validator';

import { StrongPassword } from 'src/common/decorators/password.decorator';

export class LoginDto {
  @IsEmail()
  email: string;

  @StrongPassword()
  password: string;
}
