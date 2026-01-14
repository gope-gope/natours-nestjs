import { Injectable, Query } from '@nestjs/common';
import { Tour, TourDocument } from './tours.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { APIFeatures } from 'src/utils/apiFeatures';

@Injectable()
export class ToursService {
  constructor(
    @InjectModel(Tour.name) private readonly tourModel: Model<TourDocument>,
  ) {}

  async find(@Query() queryString) {
    const features = new APIFeatures<TourDocument>(
      this.tourModel.find(),
      queryString,
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.getQuery();
    return tours;
  }

  async findOne(id: string): Promise<Tour> {
    const tour = await this.tourModel.findOne({ _id: id });
    return tour;
  }

  async create(tour: Tour): Promise<Tour> {
    const newTour = await this.tourModel.create(tour);
    return newTour;
  }

  async deleteOne(id: string) {
    return await this.tourModel.findOneAndDelete({ _id: id });
  }

  async findOneAndUpdate(id: string, body: Tour): Promise<Tour> {
    return await this.tourModel.findOneAndUpdate({ _id: id }, body, {
      returnOriginal: false,
    });
  }

  async findTop5Cheap(): Promise<Tour[]> {
    return await this.tourModel
      .find({ secretTour: { $ne: true } })
      .sort({ ratingsAverage: -1, price: 1 })
      .limit(5)
      .select('name price ratingsAverage summary difficulty')
      .exec();
  }
}
