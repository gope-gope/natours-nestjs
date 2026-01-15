import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  MinLength,
  MaxLength,
  IsEnum,
  IsArray,
  IsMongoId,
  IsDateString,
} from 'class-validator';

export enum TourDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  DIFFICULT = 'difficult',
}

export class UpdateTourDto {
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(40)
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxGroupSize?: number;

  @IsOptional()
  @IsEnum(TourDifficulty)
  difficulty?: TourDifficulty;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceDiscount?: number;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageCover?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsArray()
  @IsDateString({}, { each: true })
  startDates?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  guides?: string[];
}
