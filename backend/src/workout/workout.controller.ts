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
import { WorkoutService } from './workout.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('workouts')
@UseGuards(JwtAuthGuard)
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateWorkoutDto) {
    return this.workoutService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Req() req) {
    return this.workoutService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.workoutService.findOne(req.user.userId, +id);
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateWorkoutDto) {
    return this.workoutService.update(req.user.userId, +id, dto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.workoutService.remove(req.user.userId, +id);
  }
}
