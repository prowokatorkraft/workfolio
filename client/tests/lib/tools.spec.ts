import { describe, it, expect, vi } from 'vitest';
import {
  parsePeriod,
  formatDate,
  formatDuration,
  formatDateWithoutTime,
  formatRange,
} from '@/../../src/lib/tools';

describe('dateUtils', () => {
  describe('parsePeriod', () => {
    it('должен правильно парсить период с указанной конечной датой', () => {
      const result = parsePeriod('2020-01-15', '2023-12-20');

      expect(result.start).toEqual({ year: 2020, month: 1 });
      expect(result.end).toEqual({ year: 2023, month: 12 });
      expect(result.durationMonths).toBe(48);
      expect(result.period).toBe('2020 — 2023');
    });

    it('должен использовать текущую дату как конечную, если end не указан', () => {
      const mockDate = new Date('2024-03-15');
      vi.useFakeTimers();
      vi.setSystemTime(mockDate);

      const result = parsePeriod('2020-01-15', undefined);

      expect(result.start).toEqual({ year: 2020, month: 1 });
      expect(result.end).toBeNull();
      expect(result.period).toBe('2020 — 2024');

      vi.useRealTimers();
    });

    it('должен правильно рассчитывать длительность в месяцах', () => {
      const result1 = parsePeriod('2023-01-01', '2023-12-31');
      expect(result1.durationMonths).toBe(12);

      const result2 = parsePeriod('2023-01-01', '2023-06-30');
      expect(result2.durationMonths).toBe(6);

      const result3 = parsePeriod('2023-01-01', '2023-01-31');
      expect(result3.durationMonths).toBe(1);
    });

    it('должен правильно обрабатывать период через границу года', () => {
      const result = parsePeriod('2022-11-01', '2023-02-28');

      expect(result.start).toEqual({ year: 2022, month: 11 });
      expect(result.end).toEqual({ year: 2023, month: 2 });
      expect(result.durationMonths).toBe(4);
      expect(result.period).toBe('2022 — 2023');
    });

    it('должен правильно обрабатывать период с одинаковым годом', () => {
      const result = parsePeriod('2023-03-01', '2023-08-31');

      expect(result.start).toEqual({ year: 2023, month: 3 });
      expect(result.end).toEqual({ year: 2023, month: 8 });
      expect(result.durationMonths).toBe(6);
      expect(result.period).toBe('2023 — 2023');
    });

    it('должен правильно обрабатывать период с одним днём', () => {
      const result = parsePeriod('2023-05-15', '2023-05-15');

      expect(result.start).toEqual({ year: 2023, month: 5 });
      expect(result.end).toEqual({ year: 2023, month: 5 });
      expect(result.durationMonths).toBe(1);
      expect(result.period).toBe('2023 — 2023');
    });

    it('должен корректно обрабатывать високосные годы', () => {
      const result = parsePeriod('2020-02-01', '2021-02-01');

      expect(result.durationMonths).toBe(13);
    });
  });

  describe('formatDate', () => {
    it('должен форматировать дату в формат "мес год"', () => {
      const date = new Date('2023-12-25');
      expect(formatDate(date)).toBe('дек 2023');
    });

    it('должен правильно форматировать январь', () => {
      const date = new Date('2023-01-15');
      expect(formatDate(date)).toBe('янв 2023');
    });

    it('должен правильно форматировать февраль', () => {
      const date = new Date('2023-02-15');
      expect(formatDate(date)).toBe('фев 2023');
    });

    it('должен правильно форматировать март', () => {
      const date = new Date('2023-03-15');
      expect(formatDate(date)).toBe('мар 2023');
    });

    it('должен правильно форматировать апрель', () => {
      const date = new Date('2023-04-15');
      expect(formatDate(date)).toBe('апр 2023');
    });

    it('должен правильно форматировать май', () => {
      const date = new Date('2023-05-15');
      expect(formatDate(date)).toBe('май 2023');
    });

    it('должен правильно форматировать июнь', () => {
      const date = new Date('2023-06-15');
      expect(formatDate(date)).toBe('июн 2023');
    });

    it('должен правильно форматировать июль', () => {
      const date = new Date('2023-07-15');
      expect(formatDate(date)).toBe('июл 2023');
    });

    it('должен правильно форматировать август', () => {
      const date = new Date('2023-08-15');
      expect(formatDate(date)).toBe('авг 2023');
    });

    it('должен правильно форматировать сентябрь', () => {
      const date = new Date('2023-09-15');
      expect(formatDate(date)).toBe('сен 2023');
    });

    it('должен правильно форматировать октябрь', () => {
      const date = new Date('2023-10-15');
      expect(formatDate(date)).toBe('окт 2023');
    });

    it('должен правильно форматировать ноябрь', () => {
      const date = new Date('2023-11-15');
      expect(formatDate(date)).toBe('ноя 2023');
    });

    it('должен правильно форматировать декабрь', () => {
      const date = new Date('2023-12-15');
      expect(formatDate(date)).toBe('дек 2023');
    });
  });

  describe('formatDuration', () => {
    describe('Только годы', () => {
      it('должен форматировать 1 год', () => {
        expect(formatDuration(12)).toBe('1 год');
      });

      it('должен форматировать 2 года', () => {
        expect(formatDuration(24)).toBe('2 года');
      });

      it('должен форматировать 3 года', () => {
        expect(formatDuration(36)).toBe('3 года');
      });

      it('должен форматировать 4 года', () => {
        expect(formatDuration(48)).toBe('4 года');
      });

      it('должен форматировать 5 лет', () => {
        expect(formatDuration(60)).toBe('5 лет');
      });

      it('должен форматировать 11 лет', () => {
        expect(formatDuration(132)).toBe('11 лет');
      });

      it('должен форматировать 21 год', () => {
        expect(formatDuration(252)).toBe('21 год');
      });
    });

    describe('Только месяцы', () => {
      it('должен форматировать 1 месяц', () => {
        expect(formatDuration(1)).toBe('1 мес.');
      });

      it('должен форматировать 2 месяца', () => {
        expect(formatDuration(2)).toBe('2 мес.');
      });

      it('должен форматировать 11 месяцев', () => {
        expect(formatDuration(11)).toBe('11 мес.');
      });
    });

    describe('Годы и месяцы', () => {
      it('должен форматировать 1 год 1 месяц', () => {
        expect(formatDuration(13)).toBe('1 год 1 мес.');
      });

      it('должен форматировать 1 год 2 месяца', () => {
        expect(formatDuration(14)).toBe('1 год 2 мес.');
      });

      it('должен форматировать 2 года 3 месяца', () => {
        expect(formatDuration(27)).toBe('2 года 3 мес.');
      });

      it('должен форматировать 3 года 11 месяцев', () => {
        expect(formatDuration(47)).toBe('3 года 11 мес.');
      });

      it('должен форматировать 5 лет 1 месяц', () => {
        expect(formatDuration(61)).toBe('5 лет 1 мес.');
      });
    });

    describe('Граничные случаи', () => {
      it('должен форматировать 0 месяцев', () => {
        expect(formatDuration(0)).toBe('0 мес.');
      });

      it('должен форматировать 12 месяцев (1 год)', () => {
        expect(formatDuration(12)).toBe('1 год');
      });

      it('должен форматировать 24 месяца (2 года)', () => {
        expect(formatDuration(24)).toBe('2 года');
      });
    });
  });

  describe('formatDateWithoutTime', () => {
    it('должен форматировать дату в ISO формат без времени', () => {
      const date = new Date('2023-12-25T15:30:00Z');
      expect(formatDateWithoutTime(date)).toBe('2023-12-25');
    });

    it('должен правильно форматировать первый день месяца', () => {
      const date = new Date('2023-01-01T00:00:00Z');
      expect(formatDateWithoutTime(date)).toBe('2023-01-01');
    });

    it('должен правильно форматировать последний день года', () => {
      const date = new Date('2023-12-31T23:59:59Z');
      expect(formatDateWithoutTime(date)).toBe('2023-12-31');
    });

    it('должен правильно форматировать дату с разными часовыми поясами', () => {
      const date = new Date('2023-06-15T10:00:00+05:00');
      expect(formatDateWithoutTime(date)).toBe('2023-06-15');
    });
  });

  describe('formatRange', () => {
    it('должен форматировать диапазон дат в объект с startDate и endDate', () => {
      const start = new Date('2023-01-15');
      const end = new Date('2023-12-20');

      const result = formatRange(start, end);

      expect(result).toEqual({
        startDate: '2023-01-15',
        endDate: '2023-12-20',
      });
    });

    it('должен правильно обрабатывать одинаковые даты', () => {
      const start = new Date('2023-06-15');
      const end = new Date('2023-06-15');

      const result = formatRange(start, end);

      expect(result).toEqual({
        startDate: '2023-06-15',
        endDate: '2023-06-15',
      });
    });

    it('должен правильно обрабатывать даты в разных часовых поясах', () => {
      const start = new Date('2023-01-01T00:00:00Z');
      const end = new Date('2023-12-31T23:59:59Z');

      const result = formatRange(start, end);

      expect(result.startDate).toBe('2023-01-01');
      expect(result.endDate).toBe('2023-12-31');
    });
  });
});
