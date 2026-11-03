/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticController } from './analytic.controller';
import { AnalyticService } from './analytic.service';
import { UserAnalyticRequest } from '../../shared/entities/user-analytic-request.dto.';
import { EventAnalyticRequest } from '../../shared/entities/event-analytic-request.dto.';
import { UserGroup } from '../../shared/entities/user-group';
import { EventGroup } from '../../shared/entities/event-group';
import { MessageAnalyticRequest } from '../../shared/entities/message-analytic-request.dto.';
import { Messages } from '../../shared/entities/messages';
import { ConfigService } from '@nestjs/config';
import { AdminGuard } from '../../shared/guards/admin.guard';

describe('AnalyticController', () => {
  let controller: AnalyticController;
  let analyticService: AnalyticService;

  const mockUserGroups: UserGroup[] = [
    {
      userId: 'user1',
      eventCount: 10,
      events: [
        {
          id: 1,
          userId: 'user1',
          eventId: 1001,
          eventName: 'Login',
          description: 'Вход пользователя',
          createdAt: new Date('2024-01-01')
        }
      ]
    },
    {
      userId: 'user2',
      eventCount: 5,
      events: []
    }
  ];

  const mockEventGroups: EventGroup[] = [
    {
      id: 1001,
      name: 'Аутентификация',
      description: 'События аутентификации',
      count: 15
    },
    {
      id: 2001,
      name: 'Медиа',
      description: 'Медиа события',
      count: 8
    }
  ];

  const mockUserAnalyticsResponse = {
    eventCount: 15,
    groupCount: 2,
    groups: mockUserGroups
  };

  const emptyUserAnalyticsResponse = {
    eventCount: 0,
    groupCount: 0,
    groups: []
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticController],
      providers: [
        {
          provide: AnalyticService,
          useValue: {
            getUsers: jest.fn(),
            getEvents: jest.fn(),
            getMessages: jest.fn()
          }
        },
        {
          provide: AdminGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true)
          }
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('development')
          }
        }
      ]
    }).compile();

    controller = module.get<AnalyticController>(AnalyticController);
    analyticService = module.get<AnalyticService>(AnalyticService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAnalyticUsers', () => {
    it('должен возвращать аналитику пользователей со всеми параметрами', async () => {
      const request: UserAnalyticRequest = {
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31',
        pageSize: 10,
        page: 1
      };

      jest.spyOn(analyticService, 'getUsers').mockResolvedValue(mockUserAnalyticsResponse);

      const result = await controller.getAnalyticUsers(request);

      expect(analyticService.getUsers).toHaveBeenCalledWith(
        request.dateFrom,
        request.dateTo,
        request.pageSize,
        request.page
      );
      expect(result).toEqual(mockUserAnalyticsResponse);
      expect(result.eventCount).toBe(15);
      expect(result.groups).toHaveLength(2);
      expect(result.groups[0].userId).toBe('user1');
      expect(result.groups[0].eventCount).toBe(10);
    });

    it('должен обрабатывать запрос без опциональных параметров', async () => {
      const request: UserAnalyticRequest = {};

      jest.spyOn(analyticService, 'getUsers').mockResolvedValue(emptyUserAnalyticsResponse);

      const result = await controller.getAnalyticUsers(request);

      expect(analyticService.getUsers).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
        undefined
      );
      expect(result).toEqual(emptyUserAnalyticsResponse);
      expect(result.eventCount).toBe(0);
      expect(result.groups).toEqual([]);
    });

    it('должен обрабатывать запрос только с dateFrom', async () => {
      const request: UserAnalyticRequest = {
        dateFrom: '2024-01-01'
      };

      jest.spyOn(analyticService, 'getUsers').mockResolvedValue(mockUserAnalyticsResponse);

      await controller.getAnalyticUsers(request);

      expect(analyticService.getUsers).toHaveBeenCalledWith(
        '2024-01-01',
        undefined,
        undefined,
        undefined
      );
    });

    it('должен обрабатывать запрос только с dateTo', async () => {
      const request: UserAnalyticRequest = {
        dateTo: '2024-12-31'
      };

      jest.spyOn(analyticService, 'getUsers').mockResolvedValue(mockUserAnalyticsResponse);

      await controller.getAnalyticUsers(request);

      expect(analyticService.getUsers).toHaveBeenCalledWith(
        undefined,
        '2024-12-31',
        undefined,
        undefined
      );
    });

    it('должен обрабатывать запрос только с пагинацией', async () => {
      const request: UserAnalyticRequest = {
        pageSize: 20,
        page: 2
      };

      jest.spyOn(analyticService, 'getUsers').mockResolvedValue(mockUserAnalyticsResponse);

      await controller.getAnalyticUsers(request);

      expect(analyticService.getUsers).toHaveBeenCalledWith(undefined, undefined, 20, 2);
    });

    it('должен обрабатывать запрос только с pageSize', async () => {
      const request: UserAnalyticRequest = {
        pageSize: 15
      };

      jest.spyOn(analyticService, 'getUsers').mockResolvedValue(mockUserAnalyticsResponse);

      await controller.getAnalyticUsers(request);

      expect(analyticService.getUsers).toHaveBeenCalledWith(undefined, undefined, 15, undefined);
    });

    it('должен обрабатывать запрос только с page', async () => {
      const request: UserAnalyticRequest = {
        page: 3
      };

      jest.spyOn(analyticService, 'getUsers').mockResolvedValue(mockUserAnalyticsResponse);

      await controller.getAnalyticUsers(request);

      expect(analyticService.getUsers).toHaveBeenCalledWith(undefined, undefined, undefined, 3);
    });

    it('должен корректно обрабатывать ошибку сервиса', async () => {
      const request: UserAnalyticRequest = {
        dateFrom: '2024-01-01'
      };
      const error = new Error('Ошибка подключения к базе данных');

      jest.spyOn(analyticService, 'getUsers').mockRejectedValue(error);

      await expect(controller.getAnalyticUsers(request)).rejects.toThrow(
        'Ошибка подключения к базе данных'
      );
    });

    it('должен возвращать правильную структуру с пустыми группами', async () => {
      const request: UserAnalyticRequest = {};

      jest.spyOn(analyticService, 'getUsers').mockResolvedValue(emptyUserAnalyticsResponse);

      const result = await controller.getAnalyticUsers(request);

      expect(result).toHaveProperty('eventCount');
      expect(result).toHaveProperty('groupCount');
      expect(result).toHaveProperty('groups');
      expect(Array.isArray(result.groups)).toBe(true);
      expect(result.groups).toHaveLength(0);
    });

    it('должен обрабатывать большое значение pageSize', async () => {
      const request: UserAnalyticRequest = {
        pageSize: 1000,
        page: 1
      };

      jest.spyOn(analyticService, 'getUsers').mockResolvedValue(mockUserAnalyticsResponse);

      await controller.getAnalyticUsers(request);

      expect(analyticService.getUsers).toHaveBeenCalledWith(undefined, undefined, 1000, 1);
    });
  });

  describe('getAnalyticEvents', () => {
    it('должен возвращать аналитику событий с диапазоном дат', async () => {
      const request: EventAnalyticRequest = {
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31'
      };

      jest.spyOn(analyticService, 'getEvents').mockResolvedValue(mockEventGroups);

      const result = await controller.getAnalyticEvents(request);

      expect(analyticService.getEvents).toHaveBeenCalledWith(request.dateFrom, request.dateTo);
      expect(result).toEqual(mockEventGroups);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1001);
      expect(result[0].name).toBe('Аутентификация');
      expect(result[0].count).toBe(15);
    });

    it('должен обрабатывать запрос без параметров', async () => {
      const request: EventAnalyticRequest = {};

      jest.spyOn(analyticService, 'getEvents').mockResolvedValue([]);

      const result = await controller.getAnalyticEvents(request);

      expect(analyticService.getEvents).toHaveBeenCalledWith(undefined, undefined);
      expect(result).toEqual([]);
    });

    it('должен обрабатывать запрос только с dateFrom', async () => {
      const request: EventAnalyticRequest = {
        dateFrom: '2024-01-01'
      };

      jest.spyOn(analyticService, 'getEvents').mockResolvedValue(mockEventGroups);

      await controller.getAnalyticEvents(request);

      expect(analyticService.getEvents).toHaveBeenCalledWith('2024-01-01', undefined);
    });

    it('должен обрабатывать запрос только с dateTo', async () => {
      const request: EventAnalyticRequest = {
        dateTo: '2024-12-31'
      };

      jest.spyOn(analyticService, 'getEvents').mockResolvedValue(mockEventGroups);

      await controller.getAnalyticEvents(request);

      expect(analyticService.getEvents).toHaveBeenCalledWith(undefined, '2024-12-31');
    });

    it('должен возвращать пустой массив, когда события не найдены', async () => {
      const request: EventAnalyticRequest = {
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31'
      };

      jest.spyOn(analyticService, 'getEvents').mockResolvedValue([]);

      const result = await controller.getAnalyticEvents(request);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('должен корректно обрабатывать ошибку сервиса для событий', async () => {
      const request: EventAnalyticRequest = {
        dateFrom: '2024-01-01'
      };
      const error = new Error('Не удалось получить события');

      jest.spyOn(analyticService, 'getEvents').mockRejectedValue(error);

      await expect(controller.getAnalyticEvents(request)).rejects.toThrow(
        'Не удалось получить события'
      );
    });

    it('должен возвращать правильную структуру для групп событий', async () => {
      const request: EventAnalyticRequest = {};
      const mockEvents: EventGroup[] = [
        {
          id: 1001,
          name: 'Вход',
          description: 'Событие входа пользователя',
          count: 100
        }
      ];

      jest.spyOn(analyticService, 'getEvents').mockResolvedValue(mockEvents);

      const result = await controller.getAnalyticEvents(request);

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('count');
      expect(typeof result[0].count).toBe('number');
    });

    it('должен обрабатывать события с нулевым количеством', async () => {
      const request: EventAnalyticRequest = {};
      const eventsWithZeroCount: EventGroup[] = [
        {
          id: 1001,
          name: 'Редкое событие',
          description: 'Происходит редко',
          count: 0
        }
      ];

      jest.spyOn(analyticService, 'getEvents').mockResolvedValue(eventsWithZeroCount);

      const result = await controller.getAnalyticEvents(request);

      expect(result[0].count).toBe(0);
    });

    it('должен обрабатывать события с отсутствующим описанием', async () => {
      const request: EventAnalyticRequest = {};
      const eventsWithoutDesc: EventGroup[] = [
        {
          id: 1001,
          name: 'Простое событие',
          description: undefined,
          count: 5
        }
      ];

      jest.spyOn(analyticService, 'getEvents').mockResolvedValue(eventsWithoutDesc);

      const result = await controller.getAnalyticEvents(request);

      expect(result[0].description).toBeUndefined();
    });
  });

  describe('getAnalyticMessages', () => {
    const mockMessages: Messages = {
      messageCount: 2,
      messages: [
        {
          id: 10,
          userId: 'user1',
          eventId: 2103,
          eventName: 'user_info_message_send',
          description: 'Привет! Хочу обсудить проект',
          createdAt: new Date('2024-01-03T12:00:00Z')
        }
      ]
    };

    it('должен пробрасывать параметры в сервис сообщений', async () => {
      const request: MessageAnalyticRequest = {
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31',
        pageSize: 5,
        page: 2
      };

      jest.spyOn(analyticService, 'getMessages').mockResolvedValue(mockMessages);

      const result = await controller.getAnalyticMessages(request);

      expect(analyticService.getMessages).toHaveBeenCalledWith(
        request.dateFrom,
        request.dateTo,
        request.pageSize,
        request.page
      );
      expect(result).toEqual(mockMessages);
      expect(result.messageCount).toBe(2);
    });

    it('должен возвращать пустой список сообщений', async () => {
      jest.spyOn(analyticService, 'getMessages').mockResolvedValue({
        messageCount: 0,
        messages: []
      });

      const result = await controller.getAnalyticMessages({});

      expect(result).toEqual({ messageCount: 0, messages: [] });
    });

    it('должен корректно обрабатывать ошибку сервиса для сообщений', async () => {
      const error = new Error('Не удалось получить сообщения');
      jest.spyOn(analyticService, 'getMessages').mockRejectedValue(error);

      await expect(controller.getAnalyticMessages({})).rejects.toThrow(
        'Не удалось получить сообщения'
      );
    });
  });

  describe('Интеграционные сценарии', () => {
    it('должен обрабатывать последовательные вызовы обоих эндпоинтов', async () => {
      const userRequest: UserAnalyticRequest = { pageSize: 10 };
      const eventRequest: EventAnalyticRequest = {};

      jest.spyOn(analyticService, 'getUsers').mockResolvedValue(mockUserAnalyticsResponse);
      jest.spyOn(analyticService, 'getEvents').mockResolvedValue(mockEventGroups);

      const userResult = await controller.getAnalyticUsers(userRequest);
      const eventResult = await controller.getAnalyticEvents(eventRequest);

      expect(userResult).toEqual(mockUserAnalyticsResponse);
      expect(eventResult).toEqual(mockEventGroups);
      expect(analyticService.getUsers).toHaveBeenCalledTimes(1);
      expect(analyticService.getEvents).toHaveBeenCalledTimes(1);
    });
  });
});
