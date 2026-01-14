import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Patch,
} from '@nestjs/common';
import { ToursService } from './tours.service';
import { Tour } from './tour.schema';

@Controller('tours')
export class ToursController {
  constructor(private readonly tourService: ToursService) {}

  @Get()
  async getAllTours(): Promise<Tour[]> {
    return await this.tourService.find();
  }

  @Get('/:id')
  async getTour(@Param('id') id: string): Promise<Tour> {
    return await this.tourService.findOne(id);
  }

  @Post()
  async createTour(@Body() body): Promise<Tour> {
    return await this.tourService.create(body);
  }

  @Delete('/:id')
  async deleteTour(@Param('id') id: string) {
    await this.tourService.deleteOne(id);
  }

  @Patch('/:id')
  async updateTour(@Body() body, @Param('id') id: string) {
    return await this.tourService.findOneAndUpdate(id, body);
  }
}
