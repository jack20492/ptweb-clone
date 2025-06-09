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
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('videos')
@UseGuards(JwtAuthGuard)
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateVideoDto) {
    return this.videoService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Req() req) {
    return this.videoService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.videoService.findOne(req.user.userId, +id);
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateVideoDto) {
    return this.videoService.update(req.user.userId, +id, dto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.videoService.remove(req.user.userId, +id);
  }
}
