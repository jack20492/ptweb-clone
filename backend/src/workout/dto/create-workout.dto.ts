import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkoutDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  details: string;

  @ApiProperty({ required: false })
  videoId?: number;

  @ApiProperty()
  date: Date;
}
