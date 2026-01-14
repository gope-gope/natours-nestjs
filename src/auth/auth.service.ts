import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, User } from 'src/users/users.schema';
import { createAndSendToken } from 'src/utils/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async signup(body: User) {
    const newUser = await this.userModel.create({
      name: body.name,
      email: body.email,
      password: body.password,
      passwordConfirm: body.passwordConfirm,
    });

    const token = createAndSendToken(newUser);

    return {
      status: 'success',
      token: token,
      data: {
        newUser,
      },
    };
  }

  async login(body) {
    const { email, password } = body;
    if (!email || !password) return;

    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) throw Error('Wrong password or email address.');

    const correct = await user.correctPassword(password, user.password);
    if (!correct) throw Error('Wrong password or email address.');

    const token = createAndSendToken(user);

    return {
      status: 'success',
      token: token,
      data: {
        user,
      },
    };
  }
}
