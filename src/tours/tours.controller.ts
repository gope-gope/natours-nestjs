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

import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from 'src/common/guards/auth-guard';
import { RolesGuard } from 'src/common/guards/role-guard';

import { CreateTourDto } from './dto/create-tour-dto';
import { DistanceDto } from './dto/distance.dto';
import { MonthlyPlanDto } from './dto/monthly-plan.dto';
import { TourStatsDto } from './dto/tour-stats.dto';
import { TourDto } from './dto/tour.dto';
import { UpdateTourDto } from './dto/update-tour-dto';
import { ToursService } from './tours.service';

@Controller('tours')
export class ToursController {
  constructor(private readonly tourService: ToursService) {}

  @Get('/monthly-plan/:year')
  @Roles(['admin', 'guide'])
  @UseGuards(AuthGuard, RolesGuard)
  async getMonthlyPlan(@Param('year') year: number): Promise<MonthlyPlanDto[]> {
    const planItems = await this.tourService.getMonthlyPlan(year);
    return plainToInstance(MonthlyPlanDto, planItems, {
      excludeExtraneousValues: true,
    });
  }

  @Get('/top-5-cheap')
  async getTop5Cheap(): Promise<TourDto[]> {
    const tourDocs = await this.tourService.findTop5Cheap();
    return plainToInstance(TourDto, tourDocs, {
      excludeExtraneousValues: true,
    });
  }

  @Get('/tour-stats')
  async getTourStats(): Promise<TourStatsDto[]> {
    const tourStats = await this.tourService.getTourStats();
    return tourStats;
  }

  @Get('/tours-within/:distance/center/:latlng/unit/:unit')
  async getToursWithin(
    @Param() params: { distance: number; latlng: string; unit: 'mi' | 'km' },
  ): Promise<TourDto[]> {
    const { distance, latlng, unit } = params;
    const tourStats = await this.tourService.getToursWithin(
      distance,
      latlng,
      unit,
    );
    return tourStats;
  }

  @Get('/distances/:latlng/unit/:unit')
  async getDistances(
    @Param() params: { latlng: string; unit: 'mi' | 'km' },
  ): Promise<DistanceDto[]> {
    const { latlng, unit } = params;
    const tourStats = await this.tourService.getDistances(latlng, unit);
    return tourStats;
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
  @Roles(['admin'])
  @UseGuards(AuthGuard, RolesGuard)
  async createTour(@Body() body: CreateTourDto): Promise<TourDto> {
    const tourDoc = await this.tourService.create(body);
    return plainToInstance(TourDto, tourDoc, {
      excludeExtraneousValues: true,
    });
  }

  @Delete('/:id')
  @Roles(['admin'])
  @UseGuards(AuthGuard, RolesGuard)
  async deleteTour(@Param('id') id: string) {
    await this.tourService.deleteOne(id);
  }

  @Patch('/:id')
  @Roles(['admin'])
  @UseGuards(AuthGuard, RolesGuard)
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
