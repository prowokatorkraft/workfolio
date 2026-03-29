import { Test, TestingModule } from '@nestjs/testing';
import { EventLoggerController } from './event-logger.controller';
import { EventLoggerService } from './event-logger.service';

describe('AppController', () => {
  let appController: EventLoggerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EventLoggerController],
      providers: [EventLoggerService]
    }).compile();

    appController = app.get<EventLoggerController>(EventLoggerController);
  });

  /*describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.()).toBe('Hello World!');
    });
  });*/
});
