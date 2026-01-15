import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, User } from 'src/users/users.schema';
import { createAndSendToken } from 'src/utils/jwt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as jwt from 'jsonwebtoken';
import { UpdateMeDto } from './dto/update-me.dto';

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

    return token();
  }

  async login(body: LoginDto) {
    const { email, password } = body;

    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user)
      throw new UnauthorizedException('Wrong password or email address.');

    const correct = await user.correctPassword(password, user.password);
    if (!correct)
      throw new UnauthorizedException('Wrong password or email address.');

    const token = createAndSendToken(user);
    return token;
  }

  async updatePassword(body: UpdatePasswordDto, token: string) {
    const { passwordCurrent, password, passwordConfirm } = body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 1. Check jwt expiry
    if (decoded.exp > Date.now())
      throw new UnauthorizedException('Expired token.');

    // 2. Check if user exists
    const user = await this.userModel.findById(decoded.id).select('+password');
    if (!user) throw new UnauthorizedException('User does not exist.');

    // 3. Check is password corect
    const isCorrect = await user.correctPassword(
      passwordCurrent,
      user.password,
    );
    if (!isCorrect) throw new UnauthorizedException('Wrong password.');

    // 4. Change password
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    await user.save();

    // 5. Return new jwt
    const newToken = createAndSendToken(user);
    return newToken;
  }

  async updateMe(body: UpdateMeDto, token: string) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 1. Check jwt expiry
    if (decoded.exp > Date.now())
      throw new UnauthorizedException('Expired token.');

    // 2. Check if user exists
    const user = await this.userModel.findById(decoded.id);
    if (!user) throw new UnauthorizedException('User does not exist.');

    // 3. Update user
    const updatedUser = await this.userModel.findByIdAndUpdate(user._id, body, {
      new: true,
      returnOriginal: false,
    });

    return updatedUser;
  }
}
