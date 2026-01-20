import { StrongPassword } from 'src/common/decorators/password.decorator';

export class UpdatePasswordDto {
  @StrongPassword()
  passwordCurrent: string;

  @StrongPassword()
  password: string;

  @StrongPassword()
  passwordConfirm: string;
}
