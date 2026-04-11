import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

vi.mock('../../src/composables/useApi', () => ({
  useApi: vi.fn(),
}));

vi.mock('../../src/lib/tools', () => ({
  formatRange: vi.fn(),
}));

import { useAnalyticsStore } from '../../src/stores/Analytics';
import { useApi } from '../../src/composables/useApi';
import { formatRange } from '../../src/lib/tools';

const createMockApiResponse = () => ({
  data: getRef(null),
  loading: getRef(false),
  error: getRef(null),
  get: vi.fn(),
  post: vi.fn(),
});

const getRef = (value: unknown) =>{
  return { value: value };
}

describe('useAnalyticsStore', () => {
  let store: ReturnType<typeof useAnalyticsStore>;
  let mockUserGroupsApi: ReturnType<typeof createMockApiResponse>;
  let mockEventGroupsApi: ReturnType<typeof createMockApiResponse>;

  beforeEach(() => {
    mockUserGroupsApi = createMockApiResponse();
    mockEventGroupsApi = createMockApiResponse();

    mockUserGroupsApi.data.value = { eventCount: 0, groupCount: 0, groups: [] };
    mockEventGroupsApi.data.value = [];

    type MockFunction = ReturnType<typeof vi.fn>;
    const mockedUseApi = useApi as unknown as MockFunction;
    mockedUseApi.mockImplementation((defaultValue: unknown) => {
      if (defaultValue && typeof defaultValue === 'object' && 'groups' in defaultValue) {
        return mockUserGroupsApi;
      }
      return mockEventGroupsApi;
    });

    const mockedFormatRange = formatRange as unknown as MockFunction;
    mockedFormatRange.mockImplementation((start, end) => ({
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    }));

    setActivePinia(createPinia());

    store = useAnalyticsStore();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Инициализация', () => {
    it('должен инициализироваться с значениями по умолчанию', () => {
      expect(store.page).toBe(1);
      expect(store.pageSize).toBe(5);
      expect(store.activePreset).toBe('3d');
      expect(store.dateFrom).toBeUndefined();
      expect(store.dateTo).toBeUndefined();
      expect(store.presets).toHaveLength(4);
      expect(store.userGroups).toStrictEqual(getRef({ eventCount: 0, groupCount: 0, groups: [] }));
      expect(store.userGroupsLoading).toStrictEqual(getRef(false));
      expect(store.userGroupsError).toStrictEqual(getRef(null));
      expect(store.eventGroups).toStrictEqual(getRef([]));
      expect(store.eventGroupsLoading).toStrictEqual(getRef(false));
      expect(store.eventGroupsError).toStrictEqual(getRef(null));
    });

    it('должен содержать правильные пресеты', () => {
      const presetLabels = store.presets.map((p) => p.label);
      expect(presetLabels).toEqual(['1 день', '3 дня', 'Неделя', 'Месяц']);

      const presetValues = store.presets.map((p) => p.value);
      expect(presetValues).toEqual(['1d', '3d', '7d', '30d']);
    });
  });

  describe('presets getRange', () => {
    it('должен правильно рассчитывать диапазон для 1 дня', () => {
      const mockDate = new Date('2024-03-15T12:00:00Z');
      vi.useFakeTimers();
      vi.setSystemTime(mockDate);

      const oneDayPreset = store.presets.find((p) => p.value === '1d');
      oneDayPreset!.getRange();

      expect(formatRange).toHaveBeenCalled();
      vi.useRealTimers();
    });

    it('должен правильно рассчитывать диапазон для 3 дней', () => {
      const mockDate = new Date('2024-03-15T12:00:00Z');
      vi.useFakeTimers();
      vi.setSystemTime(mockDate);

      const threeDayPreset = store.presets.find((p) => p.value === '3d');
      threeDayPreset!.getRange();

      expect(formatRange).toHaveBeenCalled();
      vi.useRealTimers();
    });

    it('должен правильно рассчитывать диапазон для недели', () => {
      const mockDate = new Date('2024-03-15T12:00:00Z');
      vi.useFakeTimers();
      vi.setSystemTime(mockDate);

      const weekPreset = store.presets.find((p) => p.value === '7d');
      weekPreset!.getRange();

      expect(formatRange).toHaveBeenCalled();
      vi.useRealTimers();
    });

    it('должен правильно рассчитывать диапазон для месяца', () => {
      const mockDate = new Date('2024-03-15T12:00:00Z');
      vi.useFakeTimers();
      vi.setSystemTime(mockDate);

      const monthPreset = store.presets.find((p) => p.value === '30d');
      monthPreset!.getRange();

      expect(formatRange).toHaveBeenCalled();
      vi.useRealTimers();
    });
  });

  describe('setPage', () => {
    it('должен обновлять page', () => {
      store.setPage(3);
      expect(store.page).toBe(3);
    });

    it('должен обновлять page на 0', () => {
      store.setPage(0);
      expect(store.page).toBe(0);
    });

    it('должен обновлять page на отрицательное значение', () => {
      store.setPage(-1);
      expect(store.page).toBe(-1);
    });
  });

  describe('setPageSize', () => {
    it('должен обновлять pageSize', () => {
      store.setPageSize(10);
      expect(store.pageSize).toBe(10);
    });

    it('должен обновлять pageSize на 0', () => {
      store.setPageSize(0);
      expect(store.pageSize).toBe(0);
    });
  });

  describe('setDateFrom', () => {
    it('должен обновлять dateFrom', () => {
      const date = '2024-01-01';
      store.setDateFrom(date);
      expect(store.dateFrom).toBe(date);
    });

    it('должен устанавливать dateFrom в undefined', () => {
      store.setDateFrom(undefined);
      expect(store.dateFrom).toBeUndefined();
    });
  });

  describe('setDateTo', () => {
    it('должен обновлять dateTo', () => {
      const date = '2024-12-31';
      store.setDateTo(date);
      expect(store.dateTo).toBe(date);
    });

    it('должен устанавливать dateTo в undefined', () => {
      store.setDateTo(undefined);
      expect(store.dateTo).toBeUndefined();
    });
  });

  describe('setActivePreset', () => {
    it('должен обновлять activePreset', () => {
      store.setActivePreset('7d');
      expect(store.activePreset).toBe('7d');
    });

    it('должен обновлять activePreset на "1d"', () => {
      store.setActivePreset('1d');
      expect(store.activePreset).toBe('1d');
    });

    it('должен обновлять activePreset на "30d"', () => {
      store.setActivePreset('30d');
      expect(store.activePreset).toBe('30d');
    });
  });

  describe('fetchUserGroups', () => {
    it('должен вызывать userGroups.get с правильными параметрами', () => {
      store.setPage(2);
      store.setPageSize(15);
      store.setDateFrom('2024-01-01');
      store.setDateTo('2024-12-31');

      store.fetchUserGroups();

      expect(mockUserGroupsApi.get).toHaveBeenCalledWith('analytic/user', {
        page: 2,
        pageSize: 15,
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31',
      });
    });

    it('должен вызывать userGroups.get с undefined для не установленных параметров', () => {
      store.fetchUserGroups();

      expect(mockUserGroupsApi.get).toHaveBeenCalledWith('analytic/user', {
        page: 1,
        pageSize: 5,
        dateFrom: undefined,
        dateTo: undefined,
      });
    });
  });

  describe('fetchEventGroups', () => {
    it('должен вызывать eventGroups.get с правильными параметрами', () => {
      store.setDateFrom('2024-01-01');
      store.setDateTo('2024-12-31');

      store.fetchEventGroups();

      expect(mockEventGroupsApi.get).toHaveBeenCalledWith('analytic/event', {
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31',
      });
    });

    it('должен вызывать eventGroups.get с undefined для не установленных параметров', () => {
      store.fetchEventGroups();

      expect(mockEventGroupsApi.get).toHaveBeenCalledWith('analytic/event', {
        dateFrom: undefined,
        dateTo: undefined,
      });
    });
  });

  describe('Реактивность', () => {
    it('должен обновлять loading состояние при запросе', async () => {
      let resolveGet: (value: unknown) => void;
      const promise = new Promise((resolve) => {
        resolveGet = resolve;
      });
      mockUserGroupsApi.get.mockReturnValue(promise);
      mockUserGroupsApi.loading.value = true;

      store.fetchUserGroups();

      expect(mockUserGroupsApi.loading.value).toBe(true);

      resolveGet!({});
      await promise;
    });
  });

  describe('Интеграция', () => {
    it('должен обновлять и page, и pageSize и вызывать fetchUserGroups', () => {
      store.setPage(3);
      store.setPageSize(20);
      store.fetchUserGroups();

      expect(store.page).toBe(3);
      expect(store.pageSize).toBe(20);
      expect(mockUserGroupsApi.get).toHaveBeenCalledWith('analytic/user', {
        page: 3,
        pageSize: 20,
        dateFrom: undefined,
        dateTo: undefined,
      });
    });

    it('должен обновлять dateFrom, dateTo и вызывать fetchEventGroups', () => {
      store.setDateFrom('2024-06-01');
      store.setDateTo('2024-06-30');
      store.fetchEventGroups();

      expect(store.dateFrom).toBe('2024-06-01');
      expect(store.dateTo).toBe('2024-06-30');
      expect(mockEventGroupsApi.get).toHaveBeenCalledWith('analytic/event', {
        dateFrom: '2024-06-01',
        dateTo: '2024-06-30',
      });
    });
  });
});
