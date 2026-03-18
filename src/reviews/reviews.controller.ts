import { Controller, Get, Param } from '@nestjs/common';

import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  @Get('/:id')
  getTourReviews(@Param() params): Promise<any> {
    const { id } = params;
    const tourReviews = this.reviewsService.getTourReviews(id);
    return tourReviews;
  }
}
