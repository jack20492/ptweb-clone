import { PartialType } from '@nestjs/swagger';
import { CreateMealplanDto } from './create-mealplan.dto';

export class UpdateMealplanDto extends PartialType(CreateMealplanDto) {}
