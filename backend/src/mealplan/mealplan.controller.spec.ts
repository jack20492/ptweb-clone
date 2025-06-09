import { Test, TestingModule } from '@nestjs/testing';
import { MealplanController } from './mealplan.controller';
import { MealplanService } from './mealplan.service';

describe('MealplanController', () => {
  let controller: MealplanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MealplanController],
      providers: [MealplanService],
    }).compile();

    controller = module.get<MealplanController>(MealplanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
