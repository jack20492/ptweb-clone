import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateContentDto) {
    return this.prisma.content.create({ data: dto });
  }

  async findAll() {
    return this.prisma.content.findMany();
  }

  async findOne(id: number) {
    return this.prisma.content.findUnique({ where: { id } });
  }

  async update(id: number, dto: UpdateContentDto) {
    return this.prisma.content.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.content.delete({ where: { id } });
  }
}
