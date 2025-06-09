import { Test, TestingModule } from '@nestjs/testing';
import { MealplanService } from './mealplan.service';

describe('MealplanService', () => {
  let service: MealplanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MealplanService],
    }).compile();

    service = module.get<MealplanService>(MealplanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
