/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticController } from './analytic.controller';
import { AnalyticService } from './analytic.service';
import { UserAnalyticRequest } from '../../shared/entities/user-analytic-request.dto.';
import { EventAnalyticRequest } from '../../shared/entities/event-analytic-request.dto.';
import { UserGroup } from '../../shared/entities/user-group';
import { EventGroup } from '../../shared/entities/event-group';
import { DevelopmentOnlyGuard } from '../../shared/guards/development-only.guard';
import { ConfigService } from '@nestjs/config';

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
          description: 'User login',
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
      name: 'Authentication',
      description: 'Auth events',
      count: 15
    },
    {
      id: 2001,
      name: 'Media',
      description: 'Media events',
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
            getEvents: jest.fn()
          }
        },
        {
          provide: DevelopmentOnlyGuard,
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
    it('should return user analytics with all parameters', async () => {
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

    it('should handle request without optional parameters', async () => {
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

    it('should handle request with only dateFrom', async () => {
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

    it('should handle request with only dateTo', async () => {
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

    it('should handle request with only pagination', async () => {
      const request: UserAnalyticRequest = {
        pageSize: 20,
        page: 2
      };

      jest.spyOn(analyticService, 'getUsers').mockResolvedValue(mockUserAnalyticsResponse);

      await controller.getAnalyticUsers(request);

      expect(analyticService.getUsers).toHaveBeenCalledWith(undefined, undefined, 20, 2);
    });

    it('should handle request with pageSize only', async () => {
      const request: UserAnalyticRequest = {
        pageSize: 15
      };

      jest.spyOn(analyticService, 'getUsers').mockResolvedValue(mockUserAnalyticsResponse);

      await controller.getAnalyticUsers(request);

      expect(analyticService.getUsers).toHaveBeenCalledWith(undefined, undefined, 15, undefined);
    });

    it('should handle request with page only', async () => {
      const request: UserAnalyticRequest = {
        page: 3
      };

      jest.spyOn(analyticService, 'getUsers').mockResolvedValue(mockUserAnalyticsResponse);

      await controller.getAnalyticUsers(request);

      expect(analyticService.getUsers).toHaveBeenCalledWith(undefined, undefined, undefined, 3);
    });

    it('should handle service error', async () => {
      const request: UserAnalyticRequest = {
        dateFrom: '2024-01-01'
      };
      const error = new Error('Database connection failed');

      jest.spyOn(analyticService, 'getUsers').mockRejectedValue(error);

      await expect(controller.getAnalyticUsers(request)).rejects.toThrow(
        'Database connection failed'
      );
    });

    it('should return correct structure with empty groups', async () => {
      const request: UserAnalyticRequest = {};

      jest.spyOn(analyticService, 'getUsers').mockResolvedValue(emptyUserAnalyticsResponse);

      const result = await controller.getAnalyticUsers(request);

      expect(result).toHaveProperty('eventCount');
      expect(result).toHaveProperty('groupCount');
      expect(result).toHaveProperty('groups');
      expect(Array.isArray(result.groups)).toBe(true);
      expect(result.groups).toHaveLength(0);
    });

    it('should handle large pageSize value', async () => {
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
    it('should return event analytics with date range', async () => {
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
      expect(result[0].name).toBe('Authentication');
      expect(result[0].count).toBe(15);
    });

    it('should handle request without parameters', async () => {
      const request: EventAnalyticRequest = {};

      jest.spyOn(analyticService, 'getEvents').mockResolvedValue([]);

      const result = await controller.getAnalyticEvents(request);

      expect(analyticService.getEvents).toHaveBeenCalledWith(undefined, undefined);
      expect(result).toEqual([]);
    });

    it('should handle request with only dateFrom', async () => {
      const request: EventAnalyticRequest = {
        dateFrom: '2024-01-01'
      };

      jest.spyOn(analyticService, 'getEvents').mockResolvedValue(mockEventGroups);

      await controller.getAnalyticEvents(request);

      expect(analyticService.getEvents).toHaveBeenCalledWith('2024-01-01', undefined);
    });

    it('should handle request with only dateTo', async () => {
      const request: EventAnalyticRequest = {
        dateTo: '2024-12-31'
      };

      jest.spyOn(analyticService, 'getEvents').mockResolvedValue(mockEventGroups);

      await controller.getAnalyticEvents(request);

      expect(analyticService.getEvents).toHaveBeenCalledWith(undefined, '2024-12-31');
    });

    it('should return empty array when no events found', async () => {
      const request: EventAnalyticRequest = {
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31'
      };

      jest.spyOn(analyticService, 'getEvents').mockResolvedValue([]);

      const result = await controller.getAnalyticEvents(request);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle service error for events', async () => {
      const request: EventAnalyticRequest = {
        dateFrom: '2024-01-01'
      };
      const error = new Error('Failed to fetch events');

      jest.spyOn(analyticService, 'getEvents').mockRejectedValue(error);

      await expect(controller.getAnalyticEvents(request)).rejects.toThrow('Failed to fetch events');
    });

    it('should return correct structure for event groups', async () => {
      const request: EventAnalyticRequest = {};
      const mockEvents: EventGroup[] = [
        {
          id: 1001,
          name: 'Login',
          description: 'User login event',
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

    it('should handle events with zero count', async () => {
      const request: EventAnalyticRequest = {};
      const eventsWithZeroCount: EventGroup[] = [
        {
          id: 1001,
          name: 'Rare Event',
          description: 'Rarely occurs',
          count: 0
        }
      ];

      jest.spyOn(analyticService, 'getEvents').mockResolvedValue(eventsWithZeroCount);

      const result = await controller.getAnalyticEvents(request);

      expect(result[0].count).toBe(0);
    });

    it('should handle events with missing description', async () => {
      const request: EventAnalyticRequest = {};
      const eventsWithoutDesc: EventGroup[] = [
        {
          id: 1001,
          name: 'Simple Event',
          description: undefined,
          count: 5
        }
      ];

      jest.spyOn(analyticService, 'getEvents').mockResolvedValue(eventsWithoutDesc);

      const result = await controller.getAnalyticEvents(request);

      expect(result[0].description).toBeUndefined();
    });
  });

  describe('Integration scenarios', () => {
    it('should handle sequential calls to both endpoints', async () => {
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
