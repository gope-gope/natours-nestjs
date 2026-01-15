import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  passwordCurrent: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  passwordConfirm: string;
}
