import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateImageDto } from './dto/create-image.dto';

@Injectable()
export class ImageService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateImageDto) {
    return this.prisma.image.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.image.findMany({ where: { userId } });
  }

  async remove(userId: number, id: number) {
    const img = await this.prisma.image.findUnique({ where: { id } });
    if (!img || img.userId !== userId) throw new ForbiddenException();
    return this.prisma.image.delete({ where: { id } });
  }
}
