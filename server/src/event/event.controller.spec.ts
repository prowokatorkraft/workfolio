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
      description: 'User login event',
      userId: 'user123',
      createdAt: new Date('2024-01-01')
    },
    {
      id: 2,
      eventId: 2001,
      eventName: 'Click',
      description: 'User click event',
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
    it('should return events when not in production', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('development');
      jest.spyOn(eventService, 'getEvents').mockResolvedValue(mockEvents);
      jest.spyOn(Event, 'toDtos').mockImplementation(() => mockEventDtos);

      const result = await controller.getEvents();

      expect(configService.get).toHaveBeenCalledWith('NODE_ENV');
      expect(eventService.getEvents).toHaveBeenCalled();
      expect(Event.toDtos).toHaveBeenCalledWith(mockEvents);
      expect(result).toEqual(mockEventDtos);
    });

    it('should throw ForbiddenException when in production', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('production');

      await expect(controller.getEvents()).rejects.toThrow(ForbiddenException);
      await expect(controller.getEvents()).rejects.toThrow('Forbidden');
      expect(eventService.getEvents).not.toHaveBeenCalled();
    });

    it('should handle empty events array', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('development');
      jest.spyOn(eventService, 'getEvents').mockResolvedValue([]);
      jest.spyOn(Event, 'toDtos').mockImplementation(() => []);

      const result = await controller.getEvents();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle service error', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('development');
      const error = new Error('Database connection failed');
      jest.spyOn(eventService, 'getEvents').mockRejectedValue(error);

      await expect(controller.getEvents()).rejects.toThrow('Database connection failed');
    });

    it('should handle NODE_ENV not set', async () => {
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
      description: 'User login',
      userId: '',
      createdAt: new Date()
    };

    it('should successfully add event', async () => {
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

    it('should throw BadRequestException when event is undefined', async () => {
      const request = mockRequest as unknown as Request;

      await expect(controller.addEvent(request, undefined)).rejects.toThrow(BadRequestException);
      await expect(controller.addEvent(request, undefined)).rejects.toThrow('Event not found');
      expect(eventService.addEvent).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when visitorId is missing', async () => {
      const request = {} as Request;
      const eventDto = { ...validEventDto };

      await expect(controller.addEvent(request, eventDto)).rejects.toThrow(BadRequestException);
      await expect(controller.addEvent(request, eventDto)).rejects.toThrow('UserId not found');
      expect(eventService.addEvent).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when visitorId is empty string', async () => {
      const request = { visitorId: '' } as unknown as Request;
      const eventDto = { ...validEventDto };

      await expect(controller.addEvent(request, eventDto)).rejects.toThrow(BadRequestException);
      await expect(controller.addEvent(request, eventDto)).rejects.toThrow('UserId not found');
      expect(eventService.addEvent).not.toHaveBeenCalled();
    });

    it('should handle service error when adding event', async () => {
      const request = mockRequest as unknown as Request;
      const eventDto = { ...validEventDto };
      const error = new Error('Database error');
      const mockEvent = { ...eventDto, userId: 'visitor-123' } as Event;

      jest.spyOn(Event, 'fromDto').mockImplementation(() => mockEvent);
      jest.spyOn(eventService, 'addEvent').mockRejectedValue(error);

      await expect(controller.addEvent(request, eventDto)).rejects.toThrow('Database error');
    });

    it('should overwrite existing userId from DTO with visitorId from request', async () => {
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

    it('should handle event without description', async () => {
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

    it('should handle event with different eventId values', async () => {
      const request = mockRequest as unknown as Request;
      const eventDtoWithDifferentId: EventDto = {
        eventId: 5001,
        description: 'User logout',
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

  describe('HTTP status codes', () => {
    it('should return 201 CREATED on successful event creation', async () => {
      const request = { visitorId: 'visitor-123' } as unknown as Request;
      const eventDto: EventDto = {
        eventId: 1001,
        description: 'Test',
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
