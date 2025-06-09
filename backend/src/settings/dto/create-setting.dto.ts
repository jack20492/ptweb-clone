import { ApiProperty } from '@nestjs/swagger';

export class CreateSettingsDto {
  @ApiProperty()
  preferences: string;
}
