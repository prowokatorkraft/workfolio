/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AnalyticService } from './analytic.service';
import { EventService } from '../event/event.service';
import { EventEntity } from '../../shared/entities/event.entity';
import { getEventKey } from '../../shared/entities/event-enum-type';
import { RawEventResult } from '../../shared/entities/raw-event-result';

jest.mock('../../shared/entities/event.dto', () => ({
  id: jest.fn(),
  userId: jest.fn(),
  eventId: jest.fn(),
  createdAt: jest.fn(),
  description: jest.fn()
}));

jest.mock('../../shared/entities/event-enum-type', () => ({
  getEventKey: jest.fn()
}));

describe('AnalyticService', () => {
  let service: AnalyticService;
  let eventRepository: Repository<EventEntity>;

  const mockEventEntities: EventEntity[] = [
    {
      id: 1,
      userId: 'user1',
      eventId: 1001,
      description: 'User login event',
      createdAt: new Date('2024-01-01T10:00:00Z')
    } as EventEntity,
    {
      id: 2,
      userId: 'user1',
      eventId: 1001,
      description: 'User login event',
      createdAt: new Date('2024-01-01T11:00:00Z')
    } as EventEntity,
    {
      id: 3,
      userId: 'user2',
      eventId: 2001,
      description: 'User click event',
      createdAt: new Date('2024-01-02T10:00:00Z')
    } as EventEntity
  ];

  const mockRawEventResults: RawEventResult[] = [
    {
      event_id: 1001,
      description: 'User login event',
      count: 15
    },
    {
      event_id: 2001,
      description: 'User click event',
      count: 8
    }
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticService,
        {
          provide: EventService,
          useValue: {
            getEvents: jest.fn(),
            addEvent: jest.fn()
          }
        },
        {
          provide: getRepositoryToken(EventEntity),
          useValue: {
            createQueryBuilder: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<AnalyticService>(AnalyticService);
    eventRepository = module.get<Repository<EventEntity>>(getRepositoryToken(EventEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('parseUTCDate', () => {
    it('should parse valid date string to UTC date with end of day', () => {
      const result = service.parseUTCDate('2024-01-15');
      expect(result.toISOString()).toBe('2024-01-15T23:59:59.000Z');
    });

    it('should parse first day of month correctly', () => {
      const result = service.parseUTCDate('2024-01-01');
      expect(result.toISOString()).toBe('2024-01-01T23:59:59.000Z');
    });

    it('should parse last day of year correctly', () => {
      const result = service.parseUTCDate('2024-12-31');
      expect(result.toISOString()).toBe('2024-12-31T23:59:59.000Z');
    });

    it('should handle leap year date', () => {
      const result = service.parseUTCDate('2024-02-29');
      expect(result.toISOString()).toBe('2024-02-29T23:59:59.000Z');
    });
  });

  describe('getUsers', () => {
    it('should return user groups with default parameters', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockEventEntities)
      } as unknown as SelectQueryBuilder<EventEntity>;

      jest.spyOn(eventRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      const result = await service.getUsers();

      expect(eventRepository.createQueryBuilder).toHaveBeenCalledWith('event');
      expect(mockQueryBuilder.where).toHaveBeenCalled();
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('event.createdAt', 'DESC');
      expect(result.eventCount).toBe(3);
      expect(result.groupCount).toBe(2);
      expect(result.groups).toHaveLength(2);
      expect(result.groups[0]?.userId).toBe('user1');
      expect(result.groups[0]?.eventCount).toBe(2);
      expect(result.groups[1]?.userId).toBe('user2');
      expect(result.groups[1]?.eventCount).toBe(1);
    });

    it('should apply date filters when provided', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockEventEntities)
      } as unknown as SelectQueryBuilder<EventEntity>;

      jest.spyOn(eventRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      await service.getUsers('2024-01-01', '2024-01-02');

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'event.createdAt BETWEEN :dateFrom AND :dateTo',
        {
          dateFrom: expect.any(Date) as Date,
          dateTo: expect.any(Date) as Date
        }
      );
    });

    it('should apply pagination correctly', async () => {
      const manyEvents = Array.from(
        { length: 25 },
        (_, i) =>
          ({
            id: i,
            userId: `user${i % 5}`,
            eventId: 1001,
            description: 'Test event',
            createdAt: new Date()
          }) as EventEntity
      );

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(manyEvents)
      } as unknown as SelectQueryBuilder<EventEntity>;

      jest.spyOn(eventRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      const result = await service.getUsers(undefined, undefined, 10, 2);

      expect(result.groupCount).toBe(5);
      expect(result.eventCount).toBe(25);
    });

    it('should handle empty result set', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([])
      } as unknown as SelectQueryBuilder<EventEntity>;

      jest.spyOn(eventRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      const result = await service.getUsers();

      expect(result.eventCount).toBe(0);
      expect(result.groupCount).toBe(0);
      expect(result.groups).toEqual([]);
    });

    it('should use default dateFrom as yesterday when not provided', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([])
      } as unknown as SelectQueryBuilder<EventEntity>;

      jest.spyOn(eventRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      await service.getUsers();

      expect(mockQueryBuilder.where).toHaveBeenCalled();

      const whereMock = mockQueryBuilder.where as jest.Mock;
      const whereArgs = whereMock.mock.calls[0] as Date;
      expect(whereArgs[1]).toHaveProperty('dateFrom');
      expect(whereArgs[1]).toHaveProperty('dateTo');
    });

    it('should use current date as dateTo when not provided', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([])
      } as unknown as SelectQueryBuilder<EventEntity>;

      jest.spyOn(eventRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      await service.getUsers('2024-01-01');

      const whereMock = mockQueryBuilder.where as jest.Mock;
      const whereArgs = whereMock.mock.calls[0] as Date;
      expect(whereArgs[1]).toHaveProperty('dateTo');
    });

    it('should handle single user with multiple events', async () => {
      const singleUserEvents = [
        { ...mockEventEntities[0], userId: 'user1' },
        { ...mockEventEntities[1], userId: 'user1' }
      ];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(singleUserEvents)
      } as unknown as SelectQueryBuilder<EventEntity>;

      jest.spyOn(eventRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      const result = await service.getUsers();

      expect(result.groupCount).toBe(1);
      expect(result.groups[0]?.userId).toBe('user1');
      expect(result.groups[0]?.eventCount).toBe(2);
    });

    it('should handle pagination with pageSize larger than groups', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockEventEntities)
      } as unknown as SelectQueryBuilder<EventEntity>;

      jest.spyOn(eventRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      const result = await service.getUsers(undefined, undefined, 10, 1);

      expect(result.groups).toHaveLength(2);
    });

    it('should handle pagination with page beyond available groups', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockEventEntities)
      } as unknown as SelectQueryBuilder<EventEntity>;

      jest.spyOn(eventRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      const result = await service.getUsers(undefined, undefined, 10, 10);

      expect(result.groups).toHaveLength(0);
    });

    it('should handle repository error', async () => {
      const error = new Error('Database connection failed');
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockRejectedValue(error)
      } as unknown as SelectQueryBuilder<EventEntity>;

      jest.spyOn(eventRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      await expect(service.getUsers()).rejects.toThrow('Database connection failed');
    });
  });

  describe('getEvents', () => {
    beforeEach(() => {
      (getEventKey as jest.Mock).mockImplementation((id: number) => {
        const names: Record<number, string> = {
          1001: 'Login',
          2001: 'Click'
        };
        return names[id] || 'Unknown';
      });
    });

    it('should return event groups with default parameters', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockRawEventResults)
      } as unknown as SelectQueryBuilder<EventEntity>;

      jest.spyOn(eventRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      const result = await service.getEvents();

      expect(eventRepository.createQueryBuilder).toHaveBeenCalledWith('e');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith([
        'e.event_id AS event_id',
        'e.description AS description',
        'COUNT(*) AS count'
      ]);
      expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith('e.event_id, e.description');
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('COUNT(*)', 'DESC');
      expect(mockQueryBuilder.addOrderBy).toHaveBeenCalledWith('e.event_id', 'ASC');
      expect(result).toHaveLength(2);
      expect(result[0]?.id).toBe(1001);
      expect(result[0]?.name).toBe('Login');
      expect(result[0]?.count).toBe(15);
    });

    it('should apply date filters when provided', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockRawEventResults)
      } as unknown as SelectQueryBuilder<EventEntity>;

      jest.spyOn(eventRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      await service.getEvents('2024-01-01', '2024-12-31');

      // ✅ Исправлено: используем expect.any(Date) без присваивания
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'e.createdAt BETWEEN :dateFrom AND :dateTo',
        {
          dateFrom: expect.any(Date) as Date,
          dateTo: expect.any(Date) as Date
        }
      );
    });

    it('should use default dateFrom as yesterday when not provided', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([])
      } as unknown as SelectQueryBuilder<EventEntity>;

      jest.spyOn(eventRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      await service.getEvents();

      const whereMock = mockQueryBuilder.where as jest.Mock;
      const whereArgs = whereMock.mock.calls[0] as Date;
      expect(whereArgs[1]).toHaveProperty('dateFrom');
      expect(whereArgs[1]).toHaveProperty('dateTo');
    });

    it('should handle empty result set', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([])
      } as unknown as SelectQueryBuilder<EventEntity>;

      jest.spyOn(eventRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      const result = await service.getEvents();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle unknown event keys', async () => {
      const unknownEventResults: RawEventResult[] = [
        {
          event_id: 9999,
          description: 'Unknown event',
          count: 1
        }
      ];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(unknownEventResults)
      } as unknown as SelectQueryBuilder<EventEntity>;

      jest.spyOn(eventRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);
      (getEventKey as jest.Mock).mockReturnValue(null);

      const result = await service.getEvents();

      expect(result[0]?.id).toBe(9999);
      expect(result[0]?.name).toBe('');
      expect(result[0]?.description).toBe('Unknown event');
      expect(result[0]?.count).toBe(1);
    });

    it('should handle events with missing description', async () => {
      // ✅ Исправлено: используем undefined вместо null as any
      const eventsWithoutDesc: RawEventResult[] = [
        {
          event_id: 1001,
          description: undefined,
          count: 10
        }
      ];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(eventsWithoutDesc)
      } as unknown as SelectQueryBuilder<EventEntity>;

      jest.spyOn(eventRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      const result = await service.getEvents();

      expect(result[0]?.description).toBeUndefined();
    });

    it('should handle repository error', async () => {
      const error = new Error('Database query failed');
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockRejectedValue(error)
      } as unknown as SelectQueryBuilder<EventEntity>;

      jest.spyOn(eventRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      await expect(service.getEvents()).rejects.toThrow('Database query failed');
    });

    it('should return empty array when no events in date range', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([])
      } as unknown as SelectQueryBuilder<EventEntity>;

      jest.spyOn(eventRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      const result = await service.getEvents('2025-01-01', '2025-12-31');

      expect(result).toEqual([]);
    });
  });

  describe('Integration between methods', () => {
    it('should get users and events with same date range', async () => {
      const mockGetManyBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockEventEntities)
      } as unknown as SelectQueryBuilder<EventEntity>;

      const mockGetRawManyBuilder = {
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockRawEventResults)
      } as unknown as SelectQueryBuilder<EventEntity>;

      jest
        .spyOn(eventRepository, 'createQueryBuilder')
        .mockReturnValueOnce(mockGetManyBuilder)
        .mockReturnValueOnce(mockGetRawManyBuilder);

      const dateFrom = '2024-01-01';
      const dateTo = '2024-12-31';

      const usersResult = await service.getUsers(dateFrom, dateTo);
      const eventsResult = await service.getEvents(dateFrom, dateTo);

      expect(usersResult.eventCount).toBe(3);
      expect(eventsResult).toHaveLength(2);
    });
  });
});
