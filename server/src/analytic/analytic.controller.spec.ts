import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticController } from './analytic.controller';
import { AnalyticService } from './analytic.service';

describe('AppController', () => {
  let appController: AnalyticController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticController],
      providers: [AnalyticService]
    }).compile();

    appController = app.get<AnalyticController>(AnalyticController);
  });

  /*describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.()).toBe('Hello World!');
    });
  });*/
});
