import { Expose } from 'class-transformer';

import { TourDto } from './tour.dto';

export class MonthlyPlanDto {
  @Expose() numTourStarts: number;
  @Expose() tours: TourDto[];
  @Expose() month: number;
}
