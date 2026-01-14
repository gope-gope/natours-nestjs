import { Injectable, Query } from '@nestjs/common';
import { APIFeatures } from 'src/utils/apiFeatures';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async find(@Query() queryString) {
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

  async findOne(id: string): Promise<User> {
    return await this.userModel.findOne({ _id: id });
  }

  async updateOne(id: string, body: User): Promise<User> {
    return await this.userModel.findOneAndUpdate({ _id: id }, body, {
      returnOriginal: false,
    });
  }

  async deleteOne(id: string) {
    return await this.userModel.findOneAndDelete({ _id: id });
  }
}
