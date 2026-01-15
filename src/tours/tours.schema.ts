import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Query, Types } from 'mongoose';
import slugify from 'slugify';

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

TourSchema.index({ price: 1, ratingsAverage: -1 });
TourSchema.index({ slug: 1 });
TourSchema.index({ startLocation: '2dsphere' });

// Virtual populate the reviews, without having them embedded as references in the tour model.
// This 'connects the two models together'
TourSchema.virtual('reviews', {
  ref: 'Review',
  // Name of the field in the Review model where the tour is stored
  foreignField: 'tour',
  localField: '_id',
});

// Virtual properties are used when they are not needed to persist in the database
// Virtual properties cannot be used in queries, because they are not technically part of the database.
TourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

TourSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true });
});

// TourSchema.pre(/^find/, function (next) {
//   this.find({ secretTour: { $ne: true } });
//   this.start = Date.now();
// });

TourSchema.pre<Query<TourDocument[], TourDocument>>(/^find/, function () {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
});

// Pre-hook for slug updates
TourSchema.pre<Query<TourDocument, TourDocument>>(
  'findOneAndUpdate',
  function () {
    const update = this.getUpdate() as any; // TypeScript requires a cast

    // Handle $set and top-level updates
    const set = update.$set ?? update;

    if (set.name) {
      set.slug = slugify(set.name);
      if (update.$set) {
        update.$set.slug = set.slug;
      } else {
        this.setUpdate(set);
      }
    }
  },
);
