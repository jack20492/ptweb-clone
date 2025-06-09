import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Injectable()
export class TestimonialService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateTestimonialDto) {
    return this.prisma.testimonial.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.testimonial.findMany({ where: { userId } });
  }

  async findOne(userId: number, id: number) {
    const testimonial = await this.prisma.testimonial.findUnique({
      where: { id },
    });
    if (!testimonial || testimonial.userId !== userId)
      throw new ForbiddenException();
    return testimonial;
  }

  async update(userId: number, id: number, dto: UpdateTestimonialDto) {
    const testimonial = await this.prisma.testimonial.findUnique({
      where: { id },
    });
    if (!testimonial || testimonial.userId !== userId)
      throw new ForbiddenException();
    return this.prisma.testimonial.update({ where: { id }, data: dto });
  }

  async remove(userId: number, id: number) {
    const testimonial = await this.prisma.testimonial.findUnique({
      where: { id },
    });
    if (!testimonial || testimonial.userId !== userId)
      throw new ForbiddenException();
    return this.prisma.testimonial.delete({ where: { id } });
  }
}
