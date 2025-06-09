import { ApiProperty } from '@nestjs/swagger';

export class CreateContentDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;
}
