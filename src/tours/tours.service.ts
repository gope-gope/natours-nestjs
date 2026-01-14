import { Injectable } from '@nestjs/common';
import { Tour, TourDocument } from './tour.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ToursService {
  constructor(
    @InjectModel(Tour.name) private readonly tourModel: Model<TourDocument>,
  ) {}

  async find(): Promise<Tour[]> {
    return await this.tourModel.find();
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
    await this.tourModel.deleteOne({ _id: id });
  }

  async findOneAndUpdate(id: string, body: Tour): Promise<Tour> {
    return await this.tourModel.findOneAndUpdate({ _id: id }, body, {
      returnOriginal: false,
    });
  }
}
