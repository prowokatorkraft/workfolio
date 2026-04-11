/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useEventStore } from '@/../../src/stores/Event';
import type { EventEnumType } from '@/../../src/types/Event-enum-type';

const mockEventsApi = {
  data: { value: [] },
  loading: { value: false },
  error: { value: null },
  get: vi.fn(),
  post: vi.fn(),
};

const mockTimeBreaker = {
  setBreak: vi.fn(),
  getBreak: vi.fn(),
  popBreak: vi.fn(),
};

const mockClearTimeout = vi.fn();
global.clearTimeout = mockClearTimeout;

vi.mock('@/../../src/composables/useApi', () => ({
  useApi: vi.fn(() => mockEventsApi),
}));

vi.mock('@/../../src/composables/useTimeBreaker', () => ({
  useTimeBreaker: vi.fn(() => mockTimeBreaker),
}));

vi.stubEnv('VITE_LOG', 'true');

describe('useEventStore', () => {
  let store: ReturnType<typeof useEventStore>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockEventsApi.data.value = [];
    mockEventsApi.loading.value = false;
    mockEventsApi.error.value = null;
    mockTimeBreaker.setBreak.mockClear();
    mockTimeBreaker.getBreak.mockClear();
    mockTimeBreaker.popBreak.mockClear();

    setActivePinia(createPinia());

    store = useEventStore();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Инициализация', () => {
    it('должен инициализироваться с пустым массивом событий', () => {
      expect(store.events).toStrictEqual({ value: [] });
      expect(store.loading).toStrictEqual({ value: false });
      expect(store.error).toStrictEqual({ value: null });
    });
  });

  describe('handleFocus', () => {
    const eventId = 1001 as EventEnumType;
    const description = 'test-input';

    it('должен установить брейк и таймаут для нового фокуса', () => {
      mockTimeBreaker.getBreak.mockReturnValue(undefined);

      store.handleFocus(eventId, description, 500, 3000);

      expect(mockTimeBreaker.getBreak).toHaveBeenCalledWith('1001-test-input');
      expect(mockTimeBreaker.setBreak).toHaveBeenCalledWith(
        '1001-test-input',
        expect.any(Object),
        3000
      );
    });

    it('не должен устанавливать брейк если уже есть активный брейк', () => {
      mockTimeBreaker.getBreak.mockReturnValue(123);

      store.handleFocus(eventId, description, 500, 3000);

      expect(mockTimeBreaker.setBreak).not.toHaveBeenCalled();
    });

    it('должен использовать значения по умолчанию для waiting и breaking', () => {
      mockTimeBreaker.getBreak.mockReturnValue(undefined);

      store.handleFocus(eventId, description);

      expect(mockTimeBreaker.setBreak).toHaveBeenCalledWith(
        '1001-test-input',
        expect.any(Object),
        5000
      );
    });

    it('должен корректно обрабатывать числовое описание', () => {
      mockTimeBreaker.getBreak.mockReturnValue(undefined);

      store.handleFocus(eventId, 123, 500, 3000);

      expect(mockTimeBreaker.getBreak).toHaveBeenCalledWith('1001-123');
      expect(mockTimeBreaker.setBreak).toHaveBeenCalledWith('1001-123', expect.any(Object), 3000);
    });
  });

  describe('handleBlur', () => {
    const eventId = 1001 as EventEnumType;
    const description = 'test-input';

    it('должен очистить таймаут если брейк существует', () => {
      const timeoutId = 123;
      mockTimeBreaker.getBreak.mockReturnValue(timeoutId);

      store.handleBlur(eventId, description);

      expect(mockTimeBreaker.getBreak).toHaveBeenCalledWith('1001-test-input');
      expect(clearTimeout).toHaveBeenCalledWith(timeoutId);
    });

    it('не должен вызывать clearTimeout если брейк не существует', () => {
      mockTimeBreaker.getBreak.mockReturnValue(undefined);

      store.handleBlur(eventId, description);

      expect(mockTimeBreaker.getBreak).toHaveBeenCalledWith('1001-test-input');
      expect(clearTimeout).not.toHaveBeenCalled();
    });

    it('должен корректно обрабатывать числовое описание', () => {
      const timeoutId = 123;
      mockTimeBreaker.getBreak.mockReturnValue(timeoutId);

      store.handleBlur(eventId, 123);

      expect(mockTimeBreaker.getBreak).toHaveBeenCalledWith('1001-123');
      expect(clearTimeout).toHaveBeenCalledWith(timeoutId);
    });
  });

  describe('handleClick', () => {
    const eventId = 2001 as EventEnumType;
    const description = 'click-button';

    it('должен добавить событие если нет активного брейка', async () => {
      mockTimeBreaker.getBreak.mockReturnValue(undefined);
      mockEventsApi.post.mockResolvedValue(undefined);

      await store.handleClick(eventId, description, 5000);

      expect(mockTimeBreaker.getBreak).toHaveBeenCalledWith('2001-click-button');
      expect(mockTimeBreaker.setBreak).toHaveBeenCalledWith('2001-click-button', 1, 5000);
      expect(mockEventsApi.post).toHaveBeenCalledWith('event', {
        eventId: 2001,
        description: 'click-button',
      });
    });

    it('не должен добавлять событие если есть активный брейк', async () => {
      mockTimeBreaker.getBreak.mockReturnValue(123);

      await store.handleClick(eventId, description, 5000);

      expect(mockTimeBreaker.getBreak).toHaveBeenCalledWith('2001-click-button');
      expect(mockTimeBreaker.setBreak).not.toHaveBeenCalled();
      expect(mockEventsApi.post).not.toHaveBeenCalled();
    });

    it('должен использовать значение по умолчанию для breaking', async () => {
      mockTimeBreaker.getBreak.mockReturnValue(undefined);
      mockEventsApi.post.mockResolvedValue(undefined);

      await store.handleClick(eventId, description);

      expect(mockTimeBreaker.setBreak).toHaveBeenCalledWith('2001-click-button', 1, 5000);
    });

    it('должен корректно обрабатывать числовое описание', async () => {
      mockTimeBreaker.getBreak.mockReturnValue(undefined);
      mockEventsApi.post.mockResolvedValue(undefined);

      await store.handleClick(eventId, 123, 5000);

      expect(mockTimeBreaker.getBreak).toHaveBeenCalledWith('2001-123');
      expect(mockEventsApi.post).toHaveBeenCalledWith('event', {
        eventId: 2001,
        description: '123',
      });
    });
  });

  describe('fetchEvents', () => {
    it('должен вызывать events.get с правильными параметрами', async () => {
      mockEventsApi.get.mockResolvedValue(undefined);

      await store.fetchEvents();

      expect(mockEventsApi.get).toHaveBeenCalledWith('event', {});
    });

    it('должен обновлять events.data при успешном запросе', async () => {
      const mockEvents = [
        { id: 1, eventId: 1001 },
        { id: 2, eventId: 2001 },
      ];
      mockEventsApi.get.mockImplementation(async () => {
        mockEventsApi.data.value = mockEvents;
      });

      await store.fetchEvents();

      expect(mockEventsApi.get).toHaveBeenCalled();
    });
  });

  describe('addEvent', () => {
    const eventId = 3001 as EventEnumType;
    const description = 'test-event';

    it('должен отправить POST запрос при canLog = true', async () => {
      mockEventsApi.post.mockResolvedValue(undefined);

      await store.addEvent(eventId, description);

      expect(mockEventsApi.post).toHaveBeenCalledWith('event', {
        eventId: 3001,
        description: 'test-event',
      });
    });

    it('не должен отправлять POST запрос при canLog = false', async () => {
      vi.stubEnv('VITE_LOG', 'false');

      // Пересоздаём store с новым значением
      setActivePinia(createPinia());
      const newStore = useEventStore();

      await newStore.addEvent(eventId, description);

      expect(mockEventsApi.post).not.toHaveBeenCalled();

      vi.stubEnv('VITE_LOG', 'true');
    });

    it('должен обрабатывать undefined description', async () => {
      mockEventsApi.post.mockResolvedValue(undefined);

      await store.addEvent(eventId, undefined);

      expect(mockEventsApi.post).toHaveBeenCalledWith('event', {
        eventId: 3001,
        description: undefined,
      });
    });

    it('должен преобразовывать число в строку при описании', async () => {
      mockEventsApi.post.mockResolvedValue(undefined);

      await store.addEvent(eventId, 12345);

      expect(mockEventsApi.post).toHaveBeenCalledWith('event', {
        eventId: 3001,
        description: '12345',
      });
    });
  });

  describe('Интеграционные сценарии', () => {
    it('должен корректно обрабатывать последовательность focus-blur', () => {
      mockTimeBreaker.getBreak.mockReturnValueOnce(undefined).mockReturnValueOnce(123);

      store.handleFocus(1001 as EventEnumType, 'input');
      store.handleBlur(1001 as EventEnumType, 'input');

      expect(mockTimeBreaker.getBreak).toHaveBeenCalledTimes(2);
      expect(mockTimeBreaker.setBreak).toHaveBeenCalledTimes(1);
    });

    it('должен предотвращать дублирование кликов через брейк', async () => {
      mockTimeBreaker.getBreak.mockReturnValueOnce(undefined).mockReturnValueOnce(123);
      mockEventsApi.post.mockResolvedValue(undefined);

      await store.handleClick(2001 as EventEnumType, 'button');
      await store.handleClick(2001 as EventEnumType, 'button');

      expect(mockEventsApi.post).toHaveBeenCalledTimes(1);
    });

    it('должен корректно обрабатывать разные события с одинаковым описанием', async () => {
      mockTimeBreaker.getBreak.mockReturnValue(undefined);
      mockEventsApi.post.mockResolvedValue(undefined);

      await store.handleClick(1001 as EventEnumType, 'same-desc');
      await store.handleClick(2001 as EventEnumType, 'same-desc');

      expect(mockEventsApi.post).toHaveBeenCalledTimes(2);
      expect(mockTimeBreaker.setBreak).toHaveBeenCalledTimes(2);
    });
  });
});
