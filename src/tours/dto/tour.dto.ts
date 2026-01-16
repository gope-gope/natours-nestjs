import { Exclude, Expose } from 'class-transformer';
import { Types } from 'mongoose';

export class TourDto {
  @Expose() __v: number;
  @Exclude() createdAt: Date;
  @Exclude() secretTour: boolean;

  @Expose() name: string;
  @Expose() duration: number;
  @Expose() maxGroupSize: number;
  @Expose() difficulty: string;
  @Expose() ratingsAverage: number;
  @Expose() ratingsQuantity: number;
  @Expose() price: number;
  @Expose() priceDiscount: number;
  @Expose() summary: string;
  @Expose() description: string;
  @Expose() imageCover: string;
  @Expose() images: string[];
  @Expose() startDates: Date[];
  @Expose() slug: string;
  @Expose() guides: Types.ObjectId[];
}
