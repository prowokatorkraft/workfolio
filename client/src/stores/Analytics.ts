import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Preset } from '../types/Preset.ts';
import { formatRange } from '../lib/tools.ts';
import type { EventGroups } from '../types/EventGroups.ts';
import axios from 'axios';

const baseUrl = window.location.origin + '/api/analytic';
const api = axios.create({
  baseURL: window.location.origin,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

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

  const userGroups = ref<EventGroups | undefined>(undefined);
  const userGroupsLoading = ref(false);
  const userGroupsError = ref<string | null>(null);

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
  function setGroups(events: EventGroups) {
    userGroups.value = events;
  }
  function setGroupsLoading(loading: boolean) {
    userGroupsLoading.value = loading;
  }
  function setGroupsError(error: string | null) {
    userGroupsError.value = error;
  }

  async function fetchUserGroups () {
    setGroupsLoading(true);
    setGroupsError(null);
    try {
      setGroups(
        (
          await api.post(baseUrl + '/users', {
            page: page?.value,
            pageSize: pageSize?.value,
            dateFrom: dateFrom.value,
            dateTo: dateTo.value
          })
        ).data
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setGroupsError(err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
        setGroupsError((err.message));
      } else {
        setGroupsError(('Unknown error occurred'));
      }
    } finally {
      setGroupsLoading(false);
    }
  }

  return {
    page,
    pageSize,
    presets,
    activePreset,
    dateFrom,
    dateTo,
    userGroups,
    userGroupsLoading,
    userGroupsError,

    setPage,
    setPageSize,
    setDateFrom,
    setDateTo,
    setActivePreset,

    fetchUserGroups
  };
});
