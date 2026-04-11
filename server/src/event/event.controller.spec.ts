/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Event } from '../../shared/entities/event';
import { EventDto } from '../../shared/entities/event.dto';

describe('EventController', () => {
  let controller: EventController;
  let eventService: EventService;
  let configService: ConfigService;

  const mockEvents: Event[] = [
    {
      id: 1,
      eventId: 1001,
      eventName: 'Login',
      description: 'Событие входа пользователя',
      userId: 'user123',
      createdAt: new Date('2024-01-01')
    },
    {
      id: 2,
      eventId: 2001,
      eventName: 'Click',
      description: 'Событие клика пользователя',
      userId: 'user456',
      createdAt: new Date('2024-01-02')
    }
  ];

  const mockEventDtos = mockEvents.map((event) => Event.toDto(event));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: {
            getEvents: jest.fn(),
            addEvent: jest.fn()
          }
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<EventController>(EventController);
    eventService = module.get<EventService>(EventService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getEvents', () => {
    it('должен возвращать события, когда приложение не в production режиме', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('development');
      jest.spyOn(eventService, 'getEvents').mockResolvedValue(mockEvents);
      jest.spyOn(Event, 'toDtos').mockImplementation(() => mockEventDtos);

      const result = await controller.getEvents();

      expect(configService.get).toHaveBeenCalledWith('NODE_ENV');
      expect(eventService.getEvents).toHaveBeenCalled();
      expect(Event.toDtos).toHaveBeenCalledWith(mockEvents);
      expect(result).toEqual(mockEventDtos);
    });

    it('должен выбрасывать ForbiddenException, когда приложение в production режиме', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('production');

      await expect(controller.getEvents()).rejects.toThrow(ForbiddenException);
      await expect(controller.getEvents()).rejects.toThrow('Forbidden');
      expect(eventService.getEvents).not.toHaveBeenCalled();
    });

    it('должен корректно обрабатывать пустой массив событий', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('development');
      jest.spyOn(eventService, 'getEvents').mockResolvedValue([]);
      jest.spyOn(Event, 'toDtos').mockImplementation(() => []);

      const result = await controller.getEvents();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('должен корректно обрабатывать ошибку сервиса', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('development');
      const error = new Error('Ошибка подключения к базе данных');
      jest.spyOn(eventService, 'getEvents').mockRejectedValue(error);

      await expect(controller.getEvents()).rejects.toThrow('Ошибка подключения к базе данных');
    });

    it('должен корректно обрабатывать ситуацию, когда NODE_ENV не установлен', async () => {
      jest.spyOn(configService, 'get').mockReturnValue(undefined);
      jest.spyOn(eventService, 'getEvents').mockResolvedValue(mockEvents);
      jest.spyOn(Event, 'toDtos').mockImplementation(() => mockEventDtos);

      const result = await controller.getEvents();

      expect(result).toEqual(mockEventDtos);
      expect(eventService.getEvents).toHaveBeenCalled();
    });
  });

  describe('addEvent', () => {
    const mockRequest = {
      visitorId: 'visitor-123'
    };

    const validEventDto: EventDto = {
      eventId: 1001,
      description: 'Вход пользователя',
      userId: '',
      createdAt: new Date()
    };

    it('должен успешно добавлять событие', async () => {
      const request = mockRequest as unknown as Request;
      const eventDto = { ...validEventDto };
      const mockEvent = { ...eventDto, userId: 'visitor-123' } as Event;

      jest.spyOn(eventService, 'addEvent').mockResolvedValue(undefined);
      jest.spyOn(Event, 'fromDto').mockImplementation(() => mockEvent);

      await controller.addEvent(request, eventDto);

      expect(eventDto.userId).toBe('visitor-123');
      expect(Event.fromDto).toHaveBeenCalledWith({
        ...eventDto,
        userId: 'visitor-123'
      });
      expect(eventService.addEvent).toHaveBeenCalledWith(mockEvent);
    });

    it('должен выбрасывать BadRequestException, когда событие не передано', async () => {
      const request = mockRequest as unknown as Request;

      await expect(controller.addEvent(request, undefined)).rejects.toThrow(BadRequestException);
      await expect(controller.addEvent(request, undefined)).rejects.toThrow('Event not found');
      expect(eventService.addEvent).not.toHaveBeenCalled();
    });

    it('должен выбрасывать BadRequestException, когда visitorId отсутствует', async () => {
      const request = {} as Request;
      const eventDto = { ...validEventDto };

      await expect(controller.addEvent(request, eventDto)).rejects.toThrow(BadRequestException);
      await expect(controller.addEvent(request, eventDto)).rejects.toThrow('UserId not found');
      expect(eventService.addEvent).not.toHaveBeenCalled();
    });

    it('должен выбрасывать BadRequestException, когда visitorId является пустой строкой', async () => {
      const request = { visitorId: '' } as unknown as Request;
      const eventDto = { ...validEventDto };

      await expect(controller.addEvent(request, eventDto)).rejects.toThrow(BadRequestException);
      await expect(controller.addEvent(request, eventDto)).rejects.toThrow('UserId not found');
      expect(eventService.addEvent).not.toHaveBeenCalled();
    });

    it('должен корректно обрабатывать ошибку сервиса при добавлении события', async () => {
      const request = mockRequest as unknown as Request;
      const eventDto = { ...validEventDto };
      const error = new Error('Ошибка базы данных');
      const mockEvent = { ...eventDto, userId: 'visitor-123' } as Event;

      jest.spyOn(Event, 'fromDto').mockImplementation(() => mockEvent);
      jest.spyOn(eventService, 'addEvent').mockRejectedValue(error);

      await expect(controller.addEvent(request, eventDto)).rejects.toThrow('Ошибка базы данных');
    });

    it('должен перезаписывать существующий userId из DTO на visitorId из запроса', async () => {
      const request = mockRequest as unknown as Request;
      const eventDto = {
        ...validEventDto,
        userId: 'existing-user'
      };
      const mockEvent = { ...eventDto, userId: 'visitor-123' } as Event;

      jest.spyOn(Event, 'fromDto').mockImplementation(() => mockEvent);
      jest.spyOn(eventService, 'addEvent').mockResolvedValue(undefined);

      await controller.addEvent(request, eventDto);

      expect(eventDto.userId).toBe('visitor-123');
      expect(Event.fromDto).toHaveBeenCalledWith({
        ...eventDto,
        userId: 'visitor-123'
      });
    });

    it('должен корректно обрабатывать событие без описания', async () => {
      const request = mockRequest as unknown as Request;
      const eventDtoWithoutDesc: EventDto = {
        eventId: 1001,
        description: undefined,
        userId: '',
        createdAt: new Date()
      };
      const mockEvent = { ...eventDtoWithoutDesc, userId: 'visitor-123' } as Event;

      jest.spyOn(Event, 'fromDto').mockImplementation(() => mockEvent);
      jest.spyOn(eventService, 'addEvent').mockResolvedValue(undefined);

      await controller.addEvent(request, eventDtoWithoutDesc);

      expect(eventService.addEvent).toHaveBeenCalledWith(mockEvent);
    });

    it('должен корректно обрабатывать событие с разными значениями eventId', async () => {
      const request = mockRequest as unknown as Request;
      const eventDtoWithDifferentId: EventDto = {
        eventId: 5001,
        description: 'Выход пользователя',
        userId: '',
        createdAt: new Date()
      };
      const mockEvent = { ...eventDtoWithDifferentId, userId: 'visitor-123' } as Event;

      jest.spyOn(Event, 'fromDto').mockImplementation(() => mockEvent);
      jest.spyOn(eventService, 'addEvent').mockResolvedValue(undefined);

      await controller.addEvent(request, eventDtoWithDifferentId);

      expect(eventService.addEvent).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('HTTP статус коды', () => {
    it('должен возвращать 201 CREATED при успешном создании события', async () => {
      const request = { visitorId: 'visitor-123' } as unknown as Request;
      const eventDto: EventDto = {
        eventId: 1001,
        description: 'Тест',
        userId: '',
        createdAt: new Date()
      };

      jest.spyOn(eventService, 'addEvent').mockResolvedValue(undefined);
      jest.spyOn(Event, 'fromDto').mockImplementation(() => ({}) as Event);

      const result = await controller.addEvent(request, eventDto);

      expect(result).toBeUndefined();
    });
  });
});
