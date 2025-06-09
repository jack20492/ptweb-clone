import { ApiProperty } from '@nestjs/swagger';

export class CreateMealplanDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  details: string;

  @ApiProperty()
  date: Date;
}
