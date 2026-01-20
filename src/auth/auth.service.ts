import * as crypto from 'crypto';

import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Request } from 'express';

import { UserDocument, User } from 'src/users/users.schema';

import { sendEmail } from 'src/utils/email';
import { createAndSendToken } from 'src/utils/jwt';

import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async signup(body: SignupDto) {
    const newUser = await this.userModel.create({
      name: body.name,
      email: body.email,
      password: body.password,
      passwordConfirm: body.passwordConfirm,
    });

    const token = createAndSendToken(newUser);

    return token;
  }

  async login(body: LoginDto) {
    const { email, password } = body;

    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user)
      throw new UnauthorizedException(
        'Invalid email or password. Please try again.',
      );

    const correct = await user.correctPassword(password, user.password);
    if (!correct)
      throw new UnauthorizedException(
        'Invalid email or password. Please try again.',
      );

    const token = createAndSendToken(user);
    return token;
  }

  async forgotPassword(body: ForgotPasswordDto, req: Request) {
    const { email } = body;
    const user = await this.userModel.findOne({ email });
    if (!user)
      return 'If the email is registered, you will receive a reset password link sent to it!';

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    const message = `Forgot you password? Reset your password here: ${resetURL} \n If you didn't forget your password, please ignore this message.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message,
      });

      return 'If the email is registered, you will receive a reset password link sent to it!';
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      throw new ServiceUnavailableException(
        'There was an error sending the email',
      );
    }
  }

  async resetPassword(body: ResetPasswordDto, req: Request) {
    // 1. Get user based on the token
    const token = req.params.token;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.userModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // 2. If token has not expires, and there is a user, set the new password
    if (!user)
      throw new UnauthorizedException(
        'The reset password token is not valid or has expired.',
      );

    // 3. Update changedPasswordAt for the user
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 4. Log the user in, send jwt
    const newToken = createAndSendToken(user);
    return newToken;
  }
}
