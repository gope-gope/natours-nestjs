import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import * as jwt from 'jsonwebtoken';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly usersSerice: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.jwt;

    if (!token)
      throw new UnauthorizedException(
        'You are not logged in! Please login to get access.',
      );

    // 2. Verify jwt token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if user still exists
    const user = await this.usersSerice.findOne(decoded.id);
    if (!user)
      throw new UnauthorizedException(
        'The user belonging to this token no longer exists.',
      );

    // 4. Check if user changed password after the JWT was issued
    const isPasswordChangedAfterJWTIssuedTimestamp = user.changedPasswordAfter(
      decoded.iat,
    );
    if (isPasswordChangedAfterJWTIssuedTimestamp) {
      throw new UnauthorizedException(
        'Password was changed after JWT issue. Please login again.',
      );
    }

    request.user = user;

    // 5. Grant access to protected route
    return true;
  }
}
