import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useTimeBreaker } from '../../src/composables/useTimeBreaker';

describe('useTimeBreaker', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('setBreak', () => {
    it('должен установить брейк для нового ключа', () => {
      const { setBreak, getBreak } = useTimeBreaker();
      const key = 'test-key';
      const hash = 12345;
      const breaking = 1000;

      const result = setBreak(key, hash, breaking);

      expect(result).toBe(hash);
      expect(getBreak(key)).toBe(hash);
    });

    it('не должен перезаписывать существующий брейк', () => {
      const { setBreak, getBreak } = useTimeBreaker();
      const key = 'test-key';
      const hash1 = 12345;
      const hash2 = 67890;
      const breaking = 1000;

      const result1 = setBreak(key, hash1, breaking);
      const result2 = setBreak(key, hash2, breaking);

      expect(result1).toBe(hash1);
      expect(result2).toBe(hash1);
      expect(getBreak(key)).toBe(hash1);
    });

    it('должен автоматически удалять брейк после истечения времени', async () => {
      const { setBreak, getBreak } = useTimeBreaker();
      const key = 'test-key';
      const hash = 12345;
      const breaking = 1000;

      setBreak(key, hash, breaking);
      expect(getBreak(key)).toBe(hash);

      vi.advanceTimersByTime(500);
      expect(getBreak(key)).toBe(hash);

      vi.advanceTimersByTime(500);
      expect(getBreak(key)).toBeUndefined();
    });

    it('должен корректно обрабатывать несколько разных ключей', () => {
      const { setBreak, getBreak } = useTimeBreaker();

      const result1 = setBreak('key1', 111, 1000);
      const result2 = setBreak('key2', 222, 2000);
      const result3 = setBreak('key3', 333, 3000);

      expect(result1).toBe(111);
      expect(result2).toBe(222);
      expect(result3).toBe(333);

      expect(getBreak('key1')).toBe(111);
      expect(getBreak('key2')).toBe(222);
      expect(getBreak('key3')).toBe(333);
    });

    it('должен возвращать одинаковый hash для повторных вызовов до истечения таймаута', () => {
      const { setBreak } = useTimeBreaker();
      const key = 'test-key';
      const breaking = 1000;

      const firstCall = setBreak(key, 111, breaking);
      const secondCall = setBreak(key, 222, breaking);
      const thirdCall = setBreak(key, 333, breaking);

      expect(firstCall).toBe(111);
      expect(secondCall).toBe(111);
      expect(thirdCall).toBe(111);
    });
  });

  describe('getBreak', () => {
    it('должен возвращать хэш для существующего ключа', () => {
      const { setBreak, getBreak } = useTimeBreaker();
      const key = 'test-key';
      const hash = 12345;

      setBreak(key, hash, 1000);

      expect(getBreak(key)).toBe(hash);
    });

    it('должен возвращать undefined для несуществующего ключа', () => {
      const { getBreak } = useTimeBreaker();

      expect(getBreak('non-existent')).toBeUndefined();
    });

    it('должен возвращать undefined для ключа, у которого истёк таймаут', async () => {
      const { setBreak, getBreak } = useTimeBreaker();
      const key = 'test-key';

      setBreak(key, 12345, 500);
      expect(getBreak(key)).toBe(12345);

      vi.advanceTimersByTime(500);
      expect(getBreak(key)).toBeUndefined();
    });

    it('не должен удалять брейк при вызове getBreak', () => {
      const { setBreak, getBreak } = useTimeBreaker();
      const key = 'test-key';

      setBreak(key, 12345, 1000);
      getBreak(key);

      expect(getBreak(key)).toBe(12345);
    });
  });

  describe('popBreak', () => {
    it('должен возвращать хэш и удалять брейк для существующего ключа', () => {
      const { setBreak, popBreak, getBreak } = useTimeBreaker();
      const key = 'test-key';
      const hash = 12345;

      setBreak(key, hash, 1000);

      const result = popBreak(key);

      expect(result).toBe(hash);
      expect(getBreak(key)).toBeUndefined();
    });

    it('должен возвращать undefined для несуществующего ключа', () => {
      const { popBreak } = useTimeBreaker();

      expect(popBreak('non-existent')).toBeUndefined();
    });

    it('не должен выполнять таймер удаления после popBreak', async () => {
      const { setBreak, popBreak, getBreak } = useTimeBreaker();
      const key = 'test-key';

      setBreak(key, 12345, 500);
      popBreak(key);

      vi.advanceTimersByTime(1000);
      expect(getBreak(key)).toBeUndefined();
    });

    it('должен возвращать хэш при popBreak и не давать повторный доступ', () => {
      const { setBreak, popBreak } = useTimeBreaker();
      const key = 'test-key';

      setBreak(key, 12345, 1000);

      const firstPop = popBreak(key);
      const secondPop = popBreak(key);

      expect(firstPop).toBe(12345);
      expect(secondPop).toBeUndefined();
    });
  });

  describe('Интеграционные сценарии', () => {
    it('должен корректно обрабатывать множество брейков с разными таймаутами', async () => {
      const { setBreak, getBreak } = useTimeBreaker();

      setBreak('short', 111, 500);
      setBreak('medium', 222, 1000);
      setBreak('long', 333, 1500);

      expect(getBreak('short')).toBe(111);
      expect(getBreak('medium')).toBe(222);
      expect(getBreak('long')).toBe(333);

      vi.advanceTimersByTime(600);
      expect(getBreak('short')).toBeUndefined();
      expect(getBreak('medium')).toBe(222);
      expect(getBreak('long')).toBe(333);

      vi.advanceTimersByTime(500);
      expect(getBreak('short')).toBeUndefined();
      expect(getBreak('medium')).toBeUndefined();
      expect(getBreak('long')).toBe(333);

      vi.advanceTimersByTime(500);
      expect(getBreak('short')).toBeUndefined();
      expect(getBreak('medium')).toBeUndefined();
      expect(getBreak('long')).toBeUndefined();
    });

    it('должен корректно обрабатывать комбинацию setBreak и popBreak', () => {
      const { setBreak, popBreak, getBreak } = useTimeBreaker();

      setBreak('key1', 111, 1000);
      setBreak('key2', 222, 2000);

      expect(popBreak('key1')).toBe(111);
      expect(getBreak('key1')).toBeUndefined();
      expect(getBreak('key2')).toBe(222);

      setBreak('key1', 333, 500);
      expect(getBreak('key1')).toBe(333);
    });

    it('должен корректно обрабатывать повторную установку после истечения таймаута', async () => {
      const { setBreak, getBreak } = useTimeBreaker();
      const key = 'test-key';

      setBreak(key, 111, 500);
      vi.advanceTimersByTime(500);
      expect(getBreak(key)).toBeUndefined();

      setBreak(key, 222, 500);
      expect(getBreak(key)).toBe(222);

      vi.advanceTimersByTime(500);
      expect(getBreak(key)).toBeUndefined();
    });
  });
});
