import { Injectable, Query, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import * as jwt from 'jsonwebtoken';
import { DeleteResult, Model } from 'mongoose';

import { UpdateMeDto } from 'src/users/dto/update-me.dto';
import { UpdatePasswordDto } from 'src/users/dto/update-password.dto';

import { APIFeatures } from 'src/utils/apiFeatures';
import { createAndSendToken } from 'src/utils/jwt';

import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async find(@Query() queryString): Promise<UserDocument[]> {
    const features = new APIFeatures<UserDocument>(
      this.userModel.find(),
      queryString,
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await features.getQuery();
  }

  async findOne(id: string): Promise<UserDocument> {
    return await this.userModel.findOne({ _id: id });
  }

  async updateOne(id: string, body: UpdateUserDto): Promise<UserDocument> {
    return await this.userModel.findOneAndUpdate({ _id: id }, body, {
      returnOriginal: false,
    });
  }

  async deleteOne(id: string): Promise<DeleteResult> {
    return await this.userModel.findOneAndDelete({ _id: id });
  }

  async updatePassword(
    body: UpdatePasswordDto,
    token: string,
  ): Promise<string> {
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

  async updateMe(body: UpdateMeDto, token: string): Promise<UserDocument> {
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
