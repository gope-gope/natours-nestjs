import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { ToursModule } from './tours/tours.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    ToursModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
