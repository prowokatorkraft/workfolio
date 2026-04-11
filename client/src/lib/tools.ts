// ISO формат
export function parsePeriod(start: string, end: string | undefined) {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();

  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  return {
    start: {
      year: startDate.getFullYear(),
      month: startDate.getMonth() + 1,
    },
    end: end
      ? {
          year: endDate.getFullYear(),
          month: endDate.getMonth() + 1,
        }
      : null,
    durationMonths: months + 1,
    period: startDate.getFullYear() + ' — ' + endDate.getFullYear(),
  };
}

export function formatDate(date: Date): string {
  const months = [
    'янв',
    'фев',
    'мар',
    'апр',
    'май',
    'июн',
    'июл',
    'авг',
    'сен',
    'окт',
    'ноя',
    'дек',
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  const getYearsWord = (n: number): string => {
    if (n % 10 === 1 && n % 100 !== 11) return 'год';
    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return 'года';
    return 'лет';
  };

  if (years === 0) {
    return `${remainingMonths} ${remainingMonths === 1 ? 'мес.' : 'мес.'}`;
  } else if (remainingMonths === 0) {
    return `${years} ${getYearsWord(years)}`;
  }
  return `${years} ${getYearsWord(years)} ${remainingMonths} мес.`;
}

export function formatDateWithoutTime(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatRange(start: Date, end: Date) {
  return {
    startDate: formatDateWithoutTime(start),
    endDate: formatDateWithoutTime(end),
  };
}

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
