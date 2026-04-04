import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Preset } from '../types/Preset.ts';
import { formatRange } from '../lib/tools.ts';
import type { UserGroups } from '../types/UserGroups.ts';
import { useApi } from '../composables/useApi.ts';

const initialPresets: Preset[] = [
  {
    label: '1 день',
    value: '1d',
    getRange: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 1);
      return formatRange(start, end);
    }
  },
  {
    label: '3 дня',
    value: '3d',
    getRange: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 3);
      return formatRange(start, end);
    }
  },
  {
    label: 'Неделя',
    value: '7d',
    getRange: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 7);
      return formatRange(start, end);
    }
  },
  {
    label: 'Месяц',
    value: '30d',
    getRange: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 30);
      return formatRange(start, end);
    }
  }
];

export const useAnalyticsStore = defineStore('analytics', () => {
  const pageSize = ref<number>(5);
  const page = ref<number>(1);
  const dateFrom = ref<string | undefined>();
  const dateTo = ref<string | undefined>();

  const activePreset = ref<string>('3d');
  const presets = ref<Preset[]>(initialPresets);

  const userGroups = useApi<UserGroups>({ eventCount: 0, groupCount: 0, groups: [] });

  function setPage(value: number) {
    page.value = value;
  }
  function setPageSize(value: number) {
    pageSize.value = value;
  }
  function setDateFrom(date: string | undefined) {
    dateFrom.value = date;
  }
  function setDateTo(date: string | undefined) {
    dateTo.value = date;
  }
  function setActivePreset(preset: string) {
    activePreset.value = preset;
  }

  function fetchUserGroups() {
    userGroups.get('analytic/user', {
      page: page?.value,
      pageSize: pageSize?.value,
      dateFrom: dateFrom.value,
      dateTo: dateTo.value
    });
  }

  return {
    page,
    pageSize,
    presets,
    activePreset,
    dateFrom,
    dateTo,

    userGroups: userGroups.data,
    userGroupsLoading: userGroups.loading,
    userGroupsError: userGroups.error,

    setPage,
    setPageSize,
    setDateFrom,
    setDateTo,
    setActivePreset,

    fetchUserGroups
  };
});
