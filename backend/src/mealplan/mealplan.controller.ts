import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MealplanService } from './mealplan.service';
import { CreateMealplanDto } from './dto/create-mealplan.dto';
import { UpdateMealplanDto } from './dto/update-mealplan.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('mealplans')
@UseGuards(JwtAuthGuard)
export class MealplanController {
  constructor(private readonly mealplanService: MealplanService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateMealplanDto) {
    return this.mealplanService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Req() req) {
    return this.mealplanService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.mealplanService.findOne(req.user.userId, +id);
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateMealplanDto) {
    return this.mealplanService.update(req.user.userId, +id, dto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.mealplanService.remove(req.user.userId, +id);
  }
}
