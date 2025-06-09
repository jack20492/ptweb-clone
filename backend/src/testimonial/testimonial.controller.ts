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
import { TestimonialService } from './testimonial.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('testimonials')
@UseGuards(JwtAuthGuard)
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateTestimonialDto) {
    return this.testimonialService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Req() req) {
    return this.testimonialService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.testimonialService.findOne(req.user.userId, +id);
  }

  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateTestimonialDto,
  ) {
    return this.testimonialService.update(req.user.userId, +id, dto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.testimonialService.remove(req.user.userId, +id);
  }
}
