import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TourDocument = HydratedDocument<Tour>;

// Create a mongoose schema for the tours
@Schema()
export class Tour {
  // Schema definition
  @Prop({
    required: [true, 'A tour must have a name.'],
    unique: true,
    trim: true,
    minLength: [10, 'A tour name must be at least 10 characters.'],
    maxLength: [40, 'A tour name must be maximum 40 characters.'],
  })
  name: string;

  @Prop({ required: [true, 'A tour must have a duration'] })
  duration: number;

  @Prop({ required: [true, 'A tour must have a maxGroupSize'] })
  maxGroupSize: number;

  @Prop({
    required: [true, 'A tour must have a difficulty'],
    enum: ['easy', 'medium', 'difficult'],
  })
  difficulty: string;

  @Prop({
    type: Number,
    default: 4.5,
    min: [1, 'A rating must be above 1.0'],
    max: [5, 'A rating must be below 5.0'],
    set: (val) => Math.round(val * 10) / 10,
  })
  ratingsAverage: number;

  @Prop({ default: 0 })
  ratingsQuantity: number;

  @Prop({ required: [true, 'A tour must have a price'], default: 0 })
  price: number;

  @Prop({
    type: Number,
    validate: {
      validator: function (val: number) {
        // Works for CREATE, fails on PATCH if price not set
        return val < this.price;
      },
      message: 'Discount must be smaller than the price',
    },
  })
  priceDiscount: number;

  @Prop({ required: [true, 'A tour must have a description.'], trim: true })
  summary: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ required: [true, 'A tour must have a cover image.'] })
  imageCover: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop({ type: Date, default: Date.now, select: false })
  createdAt: Date;

  @Prop({ type: [Date] })
  startDates: Date[];

  @Prop()
  slug: string;

  @Prop({ default: false })
  secretTour: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  guides: Types.ObjectId[];
}

export const TourSchema = SchemaFactory.createForClass(Tour);
