import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';

@Injectable()
export class WorkoutService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateWorkoutDto) {
    return this.prisma.workout.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.workout.findMany({ where: { userId } });
  }

  async findOne(userId: number, id: number) {
    const workout = await this.prisma.workout.findUnique({ where: { id } });
    if (!workout || workout.userId !== userId) throw new ForbiddenException();
    return workout;
  }

  async update(userId: number, id: number, dto: UpdateWorkoutDto) {
    const workout = await this.prisma.workout.findUnique({ where: { id } });
    if (!workout || workout.userId !== userId) throw new ForbiddenException();
    return this.prisma.workout.update({ where: { id }, data: dto });
  }

  async remove(userId: number, id: number) {
    const workout = await this.prisma.workout.findUnique({ where: { id } });
    if (!workout || workout.userId !== userId) throw new ForbiddenException();
    return this.prisma.workout.delete({ where: { id } });
  }
}
