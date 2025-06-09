import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateVideoDto) {
    return this.prisma.video.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.video.findMany({ where: { userId } });
  }

  async findOne(userId: number, id: number) {
    const video = await this.prisma.video.findUnique({ where: { id } });
    if (!video || video.userId !== userId) throw new ForbiddenException();
    return video;
  }

  async update(userId: number, id: number, dto: UpdateVideoDto) {
    const video = await this.prisma.video.findUnique({ where: { id } });
    if (!video || video.userId !== userId) throw new ForbiddenException();
    return this.prisma.video.update({ where: { id }, data: dto });
  }

  async remove(userId: number, id: number) {
    const video = await this.prisma.video.findUnique({ where: { id } });
    if (!video || video.userId !== userId) throw new ForbiddenException();
    return this.prisma.video.delete({ where: { id } });
  }
}
