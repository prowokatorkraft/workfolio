/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EventService } from './event.service';
import { EventEntity } from '../../shared/entities/event.entity';
import { Event } from '../../shared/entities/event';

describe('EventService', () => {
  let service: EventService;
  let eventRepository: Repository<EventEntity>;

  const mockEventEntities: EventEntity[] = [
    {
      id: 1,
      eventId: 1001,
      description: 'User login event',
      userId: 'user123',
      createdAt: new Date('2024-01-01')
    },
    {
      id: 2,
      eventId: 2001,
      description: 'User click event',
      userId: 'user456',
      createdAt: new Date('2024-01-02')
    }
  ];

  const mockEvents: Event[] = mockEventEntities.map((entity) => Event.fromEntity(entity));

  const mockEvent: Event = {
    eventId: 1001,
    eventName: 'Login',
    description: 'User login event',
    userId: 'user123',
    createdAt: new Date('2024-01-01')
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getRepositoryToken(EventEntity),
          useValue: {
            find: jest.fn(),
            save: jest.fn()
          }
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<EventService>(EventService);
    eventRepository = module.get<Repository<EventEntity>>(getRepositoryToken(EventEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getEvents', () => {
    it('should return array of events when entities exist', async () => {
      jest.spyOn(eventRepository, 'find').mockResolvedValue(mockEventEntities);
      jest.spyOn(Event, 'fromEntities').mockReturnValue(mockEvents);

      const result = await service.getEvents();

      expect(eventRepository.find).toHaveBeenCalled();
      expect(Event.fromEntities).toHaveBeenCalledWith(mockEventEntities);
      expect(result).toEqual(mockEvents);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no entities found', async () => {
      jest.spyOn(eventRepository, 'find').mockResolvedValue([]);
      jest.spyOn(Event, 'fromEntities').mockReturnValue([]);

      const result = await service.getEvents();

      expect(eventRepository.find).toHaveBeenCalled();
      expect(Event.fromEntities).toHaveBeenCalledWith([]);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should return empty array when entities is null', async () => {
      jest.spyOn(eventRepository, 'find').mockResolvedValue(null as any);
      jest.spyOn(Event, 'fromEntities').mockReturnValue([]);

      const result = await service.getEvents();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should return empty array when entities is undefined', async () => {
      jest.spyOn(eventRepository, 'find').mockResolvedValue(undefined as any);
      jest.spyOn(Event, 'fromEntities').mockReturnValue([]);

      const result = await service.getEvents();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle repository error', async () => {
      const error = new Error('Database connection failed');
      jest.spyOn(eventRepository, 'find').mockRejectedValue(error);

      await expect(service.getEvents()).rejects.toThrow('Database connection failed');
    });

    it('should handle empty array correctly with fromEntities', async () => {
      jest.spyOn(eventRepository, 'find').mockResolvedValue([]);
      jest.spyOn(Event, 'fromEntities').mockImplementation((entities) => {
        return entities.map((entity) => Event.fromEntity(entity));
      });

      const result = await service.getEvents();

      expect(result).toEqual([]);
      expect(Event.fromEntities).toHaveBeenCalledWith([]);
    });
  });

  describe('addEvent', () => {
    it('should successfully save an event', async () => {
      const mockEntity = Event.toEntity(mockEvent);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(mockEntity);
      jest.spyOn(Event, 'toEntity').mockReturnValue(mockEntity);

      await service.addEvent(mockEvent);

      expect(Event.toEntity).toHaveBeenCalledWith(mockEvent);
      expect(eventRepository.save).toHaveBeenCalledWith(mockEntity);
    });

    it('should handle event with minimal fields', async () => {
      const minimalEvent: Event = {
        eventId: 1001,
        userId: 'user123'
      };
      const mockEntity = Event.toEntity(minimalEvent);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(mockEntity);
      jest.spyOn(Event, 'toEntity').mockReturnValue(mockEntity);

      await service.addEvent(minimalEvent);

      expect(eventRepository.save).toHaveBeenCalledWith(mockEntity);
    });

    it('should handle event with all optional fields', async () => {
      const fullEvent: Event = {
        eventId: 1001,
        eventName: 'Complex Event',
        description: 'Detailed description',
        userId: 'user123',
        createdAt: new Date('2024-01-01T12:00:00Z')
      };
      const mockEntity = Event.toEntity(fullEvent);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(mockEntity);
      jest.spyOn(Event, 'toEntity').mockReturnValue(mockEntity);

      await service.addEvent(fullEvent);

      expect(eventRepository.save).toHaveBeenCalledWith(mockEntity);
    });

    it('should handle event without optional fields', async () => {
      const eventWithoutOptional: Event = {
        eventId: 1001,
        userId: 'user123'
      };
      const mockEntity = Event.toEntity(eventWithoutOptional);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(mockEntity);
      jest.spyOn(Event, 'toEntity').mockReturnValue(mockEntity);

      await service.addEvent(eventWithoutOptional);

      expect(eventRepository.save).toHaveBeenCalledWith(mockEntity);
    });

    it('should handle event with empty description', async () => {
      const eventWithEmptyDesc: Event = {
        eventId: 1001,
        eventName: 'Test',
        description: '',
        userId: 'user123',
        createdAt: new Date()
      };
      const mockEntity = Event.toEntity(eventWithEmptyDesc);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(mockEntity);
      jest.spyOn(Event, 'toEntity').mockReturnValue(mockEntity);

      await service.addEvent(eventWithEmptyDesc);

      expect(eventRepository.save).toHaveBeenCalledWith(mockEntity);
    });

    it('should handle repository error on save', async () => {
      const error = new Error('Failed to save event');
      const mockEntity = Event.toEntity(mockEvent);
      jest.spyOn(Event, 'toEntity').mockReturnValue(mockEntity);
      jest.spyOn(eventRepository, 'save').mockRejectedValue(error);

      await expect(service.addEvent(mockEvent)).rejects.toThrow('Failed to save event');
    });

    it('should handle duplicate key error', async () => {
      const error = new Error('Duplicate key violation');
      const mockEntity = Event.toEntity(mockEvent);
      jest.spyOn(Event, 'toEntity').mockReturnValue(mockEntity);
      jest.spyOn(eventRepository, 'save').mockRejectedValue(error);

      await expect(service.addEvent(mockEvent)).rejects.toThrow('Duplicate key violation');
    });
  });

  describe('Integration between methods', () => {
    it('should save and then retrieve the same event', async () => {
      const newEvent: Event = {
        eventId: 3001,
        eventName: 'Integration Test',
        description: 'Testing save and retrieve',
        userId: 'user789',
        createdAt: new Date()
      };

      const savedEntity = Event.toEntity(newEvent);
      jest.spyOn(Event, 'toEntity').mockReturnValue(savedEntity);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(savedEntity);

      jest.spyOn(eventRepository, 'find').mockResolvedValue([savedEntity]);
      jest.spyOn(Event, 'fromEntities').mockReturnValue([newEvent]);

      await service.addEvent(newEvent);
      const events = await service.getEvents();

      expect(eventRepository.save).toHaveBeenCalledWith(savedEntity);
      expect(eventRepository.find).toHaveBeenCalled();
      expect(events).toContainEqual(newEvent);
    });
  });
});
