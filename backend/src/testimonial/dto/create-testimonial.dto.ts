import { ApiProperty } from '@nestjs/swagger';

export class CreateTestimonialDto {
  @ApiProperty()
  content: string;
}
