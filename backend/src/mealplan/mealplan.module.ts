import { Module } from '@nestjs/common';
import { MealplanService } from './mealplan.service';
import { MealplanController } from './mealplan.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [MealplanController],
  providers: [MealplanService, PrismaService],
})
export class MealplanModule {}
