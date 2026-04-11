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
      description: 'Событие входа пользователя',
      createdAt: new Date('2024-01-01T10:00:00Z')
    } as EventEntity,
    {
      id: 2,
      userId: 'user1',
      eventId: 1001,
      description: 'Событие входа пользователя',
      createdAt: new Date('2024-01-01T11:00:00Z')
    } as EventEntity,
    {
      id: 3,
      userId: 'user2',
      eventId: 2001,
      description: 'Событие клика пользователя',
      createdAt: new Date('2024-01-02T10:00:00Z')
    } as EventEntity
  ];

  const mockRawEventResults: RawEventResult[] = [
    {
      event_id: 1001,
      description: 'Событие входа пользователя',
      count: 15
    },
    {
      event_id: 2001,
      description: 'Событие клика пользователя',
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
    it('должен преобразовывать валидную строку даты в UTC дату с концом дня', () => {
      const result = service.parseUTCDate('2024-01-15');
      expect(result.toISOString()).toBe('2024-01-15T23:59:59.000Z');
    });

    it('должен правильно преобразовывать первый день месяца', () => {
      const result = service.parseUTCDate('2024-01-01');
      expect(result.toISOString()).toBe('2024-01-01T23:59:59.000Z');
    });

    it('должен правильно преобразовывать последний день года', () => {
      const result = service.parseUTCDate('2024-12-31');
      expect(result.toISOString()).toBe('2024-12-31T23:59:59.000Z');
    });

    it('должен обрабатывать дату високосного года', () => {
      const result = service.parseUTCDate('2024-02-29');
      expect(result.toISOString()).toBe('2024-02-29T23:59:59.000Z');
    });
  });

  describe('getUsers', () => {
    it('должен возвращать группы пользователей с параметрами по умолчанию', async () => {
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

    it('должен применять фильтры по датам, когда они переданы', async () => {
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

    it('должен правильно применять пагинацию', async () => {
      const manyEvents = Array.from(
        { length: 25 },
        (_, i) =>
          ({
            id: i,
            userId: `user${i % 5}`,
            eventId: 1001,
            description: 'Тестовое событие',
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

    it('должен обрабатывать пустой результат', async () => {
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

    it('должен использовать вчерашнюю дату как dateFrom по умолчанию', async () => {
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

    it('должен использовать текущую дату как dateTo по умолчанию', async () => {
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

    it('должен обрабатывать одного пользователя с множеством событий', async () => {
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

    it('должен обрабатывать пагинацию с размером страницы больше количества групп', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockEventEntities)
      } as unknown as SelectQueryBuilder<EventEntity>;

      jest.spyOn(eventRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      const result = await service.getUsers(undefined, undefined, 10, 1);

      expect(result.groups).toHaveLength(2);
    });

    it('должен обрабатывать пагинацию с номером страницы за пределами доступных групп', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockEventEntities)
      } as unknown as SelectQueryBuilder<EventEntity>;

      jest.spyOn(eventRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      const result = await service.getUsers(undefined, undefined, 10, 10);

      expect(result.groups).toHaveLength(0);
    });

    it('должен корректно обрабатывать ошибку репозитория', async () => {
      const error = new Error('Ошибка подключения к базе данных');
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockRejectedValue(error)
      } as unknown as SelectQueryBuilder<EventEntity>;

      jest.spyOn(eventRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      await expect(service.getUsers()).rejects.toThrow('Ошибка подключения к базе данных');
    });
  });

  describe('getEvents', () => {
    beforeEach(() => {
      (getEventKey as jest.Mock).mockImplementation((id: number) => {
        const names: Record<number, string> = {
          1001: 'Вход',
          2001: 'Клик'
        };
        return names[id] || 'Неизвестно';
      });
    });

    it('должен возвращать группы событий с параметрами по умолчанию', async () => {
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
      expect(result[0]?.name).toBe('Вход');
      expect(result[0]?.count).toBe(15);
    });

    it('должен применять фильтры по датам, когда они переданы', async () => {
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

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'e.createdAt BETWEEN :dateFrom AND :dateTo',
        {
          dateFrom: expect.any(Date) as Date,
          dateTo: expect.any(Date) as Date
        }
      );
    });

    it('должен использовать вчерашнюю дату как dateFrom по умолчанию', async () => {
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

    it('должен обрабатывать пустой результат', async () => {
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

    it('должен обрабатывать неизвестные ключи событий', async () => {
      const unknownEventResults: RawEventResult[] = [
        {
          event_id: 9999,
          description: 'Неизвестное событие',
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
      expect(result[0]?.description).toBe('Неизвестное событие');
      expect(result[0]?.count).toBe(1);
    });

    it('должен обрабатывать события с отсутствующим описанием', async () => {
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

    it('должен корректно обрабатывать ошибку репозитория', async () => {
      const error = new Error('Ошибка выполнения запроса к базе данных');
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockRejectedValue(error)
      } as unknown as SelectQueryBuilder<EventEntity>;

      jest.spyOn(eventRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

      await expect(service.getEvents()).rejects.toThrow('Ошибка выполнения запроса к базе данных');
    });

    it('должен возвращать пустой массив, когда нет событий в диапазоне дат', async () => {
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

  describe('Интеграция между методами', () => {
    it('должен получать пользователей и события с одинаковым диапазоном дат', async () => {
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
