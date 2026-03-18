import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import { Review, ReviewDocument } from './reviews.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
  ) {}

  async getTourReviews(tourId: Types.ObjectId) {
    const tourReviews = await this.reviewModel.find({ tour: tourId });
    return tourReviews;
  }
}
