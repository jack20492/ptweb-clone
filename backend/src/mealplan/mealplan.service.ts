import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMealplanDto } from './dto/create-mealplan.dto';
import { UpdateMealplanDto } from './dto/update-mealplan.dto';

@Injectable()
export class MealplanService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateMealplanDto) {
    return this.prisma.mealPlan.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.mealPlan.findMany({ where: { userId } });
  }

  async findOne(userId: number, id: number) {
    const mealplan = await this.prisma.mealPlan.findUnique({ where: { id } });
    if (!mealplan || mealplan.userId !== userId) throw new ForbiddenException();
    return mealplan;
  }

  async update(userId: number, id: number, dto: UpdateMealplanDto) {
    const mealplan = await this.prisma.mealPlan.findUnique({ where: { id } });
    if (!mealplan || mealplan.userId !== userId) throw new ForbiddenException();
    return this.prisma.mealPlan.update({ where: { id }, data: dto });
  }

  async remove(userId: number, id: number) {
    const mealplan = await this.prisma.mealPlan.findUnique({ where: { id } });
    if (!mealplan || mealplan.userId !== userId) throw new ForbiddenException();
    return this.prisma.mealPlan.delete({ where: { id } });
  }
}
