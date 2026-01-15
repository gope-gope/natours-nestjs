import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsUrl,
} from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  passwordConfirm: string;
}
