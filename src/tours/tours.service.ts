import { BadRequestException, Injectable, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { DeleteResult, Model } from 'mongoose';

import { APIFeatures } from 'src/utils/apiFeatures';

import { CreateTourDto } from './dto/create-tour-dto';
import { DistanceDto } from './dto/distance.dto';
import { MonthlyPlanDto } from './dto/monthly-plan.dto';
import { TourStatsDto } from './dto/tour-stats.dto';
import { UpdateTourDto } from './dto/update-tour-dto';
import { Tour, TourDocument } from './tours.schema';

@Injectable()
export class ToursService {
  constructor(
    @InjectModel(Tour.name) private readonly tourModel: Model<TourDocument>,
  ) {}

  async find(@Query() queryString): Promise<TourDocument[]> {
    const features = new APIFeatures<TourDocument>(
      this.tourModel.find(),
      queryString,
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await features.getQuery();
  }

  async findOne(id: string): Promise<TourDocument> {
    return await this.tourModel.findOne({ _id: id });
  }

  async create(tour: CreateTourDto): Promise<TourDocument> {
    return await this.tourModel.create(tour);
  }

  async deleteOne(id: string): Promise<DeleteResult> {
    return await this.tourModel.deleteOne({ _id: id });
  }

  async findOneAndUpdate(
    id: string,
    body: UpdateTourDto,
  ): Promise<TourDocument> {
    return await this.tourModel.findOneAndUpdate({ _id: id }, body, {
      returnOriginal: false,
    });
  }

  async findTop5Cheap(): Promise<TourDocument[]> {
    return await this.tourModel
      .find({ secretTour: { $ne: true } })
      .sort({ ratingsAverage: -1, price: 1 })
      .limit(5)
      .select('name price ratingsAverage summary difficulty')
      .exec();
  }

  async getMonthlyPlan(year: number): Promise<MonthlyPlanDto[]> {
    const plan = await this.tourModel.aggregate([
      {
        // Aggregation operator as defined by mongodb
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          // Push the name of the tour in an array
          tours: { $push: '$name' },
        },
      },
      // Add field month with ID of value
      {
        $addFields: { month: '$_id' },
      },
      // Makes _id no longer show up
      {
        $project: {
          _id: 0,
        },
      },
      // Sort ascending months
      {
        $sort: {
          month: 1,
        },
      },
      // Limit results to 12
      {
        $limit: 12,
      },
    ]);

    return plan;
  }

  async getTourStats(): Promise<TourStatsDto[]> {
    const stats = await this.tourModel.aggregate([
      {
        // Aggregation operator as defined by mongodb
        $match: {
          // Target field: { mongodb_operator: targetValue }
          ratingsAverage: { $gte: 0 },
        },
      },
      {
        // Aggregation operator as defined by mongodb
        $group: {
          // Group by fieldName. In this case, the query will return 3 aggregated objects, one for each difficulty -- easy, medium, difficult
          _id: '$difficulty',
          // New named field: { mongodb_operator: '$targetField' }
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: {
          avgPrice: 1,
        },
      },
    ]);

    return stats;
  }

  async getToursWithin(
    distance: number,
    latlng: string,
    unit: 'mi' | 'km',
  ): Promise<TourDocument[]> {
    const [lat, lng] = latlng.split(',');
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if (!lat || !lng) {
      throw new BadRequestException(
        'The provided coordinates format must be lat,lng.',
      );
    }

    const tours = await this.tourModel.find({
      startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    return tours;
  }

  async getDistances(
    latlng: string,
    unit: 'mi' | 'km',
  ): Promise<DistanceDto[]> {
    const [lat, lng] = latlng.split(',');

    if (!lat || !lng) {
      throw new BadRequestException(
        'The provided coordinates format must be lat,lng.',
      );
    }

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    const distances = await this.tourModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [+lng, +lat],
          },
          distanceField: 'distance',
          distanceMultiplier: multiplier,
        },
      },
      {
        $project: {
          distance: 1,
          name: 1,
        },
      },
    ]);

    return distances;
  }
}
