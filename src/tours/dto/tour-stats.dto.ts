import { IsString, IsNumber, Min } from 'class-validator';

export class TourStatsDto {
  @IsString()
  _id: string;

  @IsNumber()
  @Min(0)
  numTours: number;

  @IsNumber()
  @Min(0)
  numRatings: number;

  @IsNumber()
  avgRating: number;

  @IsNumber()
  avgPrice: number;

  @IsNumber()
  minPrice: number;

  @IsNumber()
  maxPrice: number;
}
