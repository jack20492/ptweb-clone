import { Module } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { WorkoutController } from './workout.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [WorkoutController],
  providers: [WorkoutService, PrismaService],
})
export class WorkoutModule {}
