import { Injectable, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { DeleteResult, Model } from 'mongoose';

import { APIFeatures } from 'src/utils/apiFeatures';

import { CreateTourDto } from './dto/create-tour-dto';
import { UpdateTourDto } from './dto/update-tour-dto';
import { Tour, TourDocument } from './tours.schema';

@Injectable()
export class ToursService {
  constructor(
    @InjectModel(Tour.name) private readonly tourModel: Model<TourDocument>,
  ) {}

  async find(@Query() queryString): Promise<TourDocument[]> {
    const features = new APIFeatures<TourDocument>(
      this.tourModel.find(),
      queryString,
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await features.getQuery();
  }

  async findOne(id: string): Promise<TourDocument> {
    return await this.tourModel.findOne({ _id: id });
  }

  async create(tour: CreateTourDto): Promise<TourDocument> {
    return await this.tourModel.create(tour);
  }

  async deleteOne(id: string): Promise<DeleteResult> {
    return await this.tourModel.deleteOne({ _id: id });
  }

  async findOneAndUpdate(
    id: string,
    body: UpdateTourDto,
  ): Promise<TourDocument> {
    return await this.tourModel.findOneAndUpdate({ _id: id }, body, {
      returnOriginal: false,
    });
  }

  async findTop5Cheap(): Promise<TourDocument[]> {
    return await this.tourModel
      .find({ secretTour: { $ne: true } })
      .sort({ ratingsAverage: -1, price: 1 })
      .limit(5)
      .select('name price ratingsAverage summary difficulty')
      .exec();
  }
}
