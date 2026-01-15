import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ToursController } from './tours.controller';
import { TourSchema, Tour } from './tours.schema';
import { ToursService } from './tours.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tour.name, schema: TourSchema }]),
  ],
  controllers: [ToursController],
  providers: [ToursService],
})
export class ToursModule {}
