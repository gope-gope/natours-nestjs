import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {
  Schema as MongooseSchema,
  HydratedDocument,
  Query,
  Types,
} from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema()
export class Review {
  @Prop({
    required: true,
    trim: true,
    minLength: [10, 'A review must be at least 10 characters.'],
    maxLength: [250, 'A review must be maximum 250 characters.'],
  })
  review: string;

  @Prop({
    required: true,
    min: 1,
    max: 5,
  })
  rating: number;

  @Prop({
    default: Date.now(),
  })
  createdAt: Date;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Tour',
    required: [true, 'A tour is required for the review.'],
  })
  tour: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A user is required for the review.'],
  })
  user: Types.ObjectId;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.pre<Query<ReviewDocument[], ReviewDocument>>(/^find/, function () {
  this.populate({ path: 'user', select: 'name photo' });
});
