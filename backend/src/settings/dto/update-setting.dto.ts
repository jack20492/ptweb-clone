import { PartialType } from '@nestjs/swagger';
import { CreateSettingsDto } from './create-setting.dto';

export class UpdateSettingsDto extends PartialType(CreateSettingsDto) {}
