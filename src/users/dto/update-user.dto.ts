import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { UserRole } from '../users.schema';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsUrl()
  photo?: string;

  @IsOptional()
  active?: boolean;

  @IsOptional()
  role?: UserRole;
}
