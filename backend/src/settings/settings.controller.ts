import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingsDto } from './dto/create-setting.dto';
import { UpdateSettingsDto } from './dto/update-setting.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  createOrUpdate(@Req() req, @Body() dto: CreateSettingsDto) {
    return this.settingsService.createOrUpdate(req.user.userId, dto);
  }

  @Get()
  get(@Req() req) {
    return this.settingsService.getSettings(req.user.userId);
  }
}
