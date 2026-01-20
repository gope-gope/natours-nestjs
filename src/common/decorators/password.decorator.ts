// strong-password.decorator.ts
import { IsStrongPassword, ValidationOptions } from 'class-validator';

export function StrongPassword(validationOptions?: ValidationOptions) {
  return IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must contain uppercase, lowercase, number, symbol and be at least 8 characters',
      ...validationOptions,
    },
  );
}
