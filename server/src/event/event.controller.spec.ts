import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';

describe('AppController', () => {
  let appController: EventController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [EventService]
    }).compile();

    appController = app.get<EventController>(EventController);
  });

  /*describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.()).toBe('Hello World!');
    });
  });*/
});
