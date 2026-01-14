import { Module } from '@nestjs/common';
import { TourSchema, Tour } from './tour.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ToursController } from './tours.controller';
import { ToursService } from './tours.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tour.name, schema: TourSchema }]),
  ],
  controllers: [ToursController],
  providers: [ToursService],
})
export class ToursModule {}
