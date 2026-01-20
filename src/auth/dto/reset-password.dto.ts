import { StrongPassword } from 'src/common/decorators/password.decorator';

export class ResetPasswordDto {
  @StrongPassword()
  password: string;

  @StrongPassword()
  passwordConfirm: string;
}
