import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsUrl,
} from 'class-validator';

import { StrongPassword } from 'src/common/decorators/password.decorator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsUrl()
  photo?: string;

  @StrongPassword()
  password: string;

  @StrongPassword()
  passwordConfirm: string;
}
