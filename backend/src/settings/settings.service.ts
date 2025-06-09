import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSettingsDto } from './dto/create-setting.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdate(userId: number, dto: CreateSettingsDto) {
    return this.prisma.settings.upsert({
      where: { userId },
      update: { ...dto },
      create: { ...dto, userId },
    });
  }

  async getSettings(userId: number) {
    return this.prisma.settings.findUnique({ where: { userId } });
  }
}
