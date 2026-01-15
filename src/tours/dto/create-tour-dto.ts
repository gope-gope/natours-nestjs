import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  IsMongoId,
  IsDateString,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateTourDto {
  @IsString()
  @MinLength(10)
  @MaxLength(40)
  name: string;

  @IsNumber()
  @Min(1)
  duration: number;

  @IsNumber()
  @Min(1)
  maxGroupSize: number;

  @IsEnum(['easy', 'medium', 'difficult'])
  difficulty: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceDiscount?: number;

  @IsString()
  summary: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  imageCover: string;

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
