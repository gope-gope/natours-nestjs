import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { ProtectGuard } from 'src/common/guards/protect-guard';

import { CreateTourDto } from './dto/create-tour-dto';
import { TourDto } from './dto/tour.dto';
import { UpdateTourDto } from './dto/update-tour-dto';
import { ToursService } from './tours.service';

@Controller('tours')
export class ToursController {
  constructor(private readonly tourService: ToursService) {}

  @Get('/top-5-cheap')
  async getTop5Cheap(): Promise<TourDto[]> {
    const tourDocs = await this.tourService.findTop5Cheap();
    return plainToInstance(TourDto, tourDocs, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  async getAllTours(@Query() params): Promise<TourDto[]> {
    const tourDocs = await this.tourService.find(params);
    return plainToInstance(TourDto, tourDocs, {
      excludeExtraneousValues: true,
    });
  }

  @Get('/:id')
  async getTour(@Param('id') id: string): Promise<TourDto> {
    const tourDoc = await this.tourService.findOne(id);
    return plainToInstance(TourDto, tourDoc, {
      excludeExtraneousValues: true,
    });
  }

  @Post()
  @UseGuards(ProtectGuard)
  async createTour(@Body() body: CreateTourDto): Promise<TourDto> {
    const tourDoc = await this.tourService.create(body);
    return plainToInstance(TourDto, tourDoc, {
      excludeExtraneousValues: true,
    });
  }

  @Delete('/:id')
  @UseGuards(ProtectGuard)
  async deleteTour(@Param('id') id: string) {
    await this.tourService.deleteOne(id);
  }

  @Patch('/:id')
  @UseGuards(ProtectGuard)
  async updateTour(
    @Body() body: UpdateTourDto,
    @Param('id') id: string,
  ): Promise<TourDto> {
    const tourDoc = await this.tourService.findOneAndUpdate(id, body);
    return plainToInstance(TourDto, tourDoc, {
      excludeExtraneousValues: true,
    });
  }
}
