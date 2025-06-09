import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('images')
@UseGuards(JwtAuthGuard)
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateImageDto) {
    return this.imageService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Req() req) {
    return this.imageService.findAll(req.user.userId);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.imageService.remove(req.user.userId, +id);
  }
}
