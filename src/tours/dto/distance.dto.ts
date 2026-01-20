import { IsString, IsNumber } from 'class-validator';

export class DistanceDto {
  @IsString()
  _id: string;

  @IsString()
  name: string;

  @IsNumber()
  distance: number;
}
