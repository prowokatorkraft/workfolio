import { ref } from 'vue';
import axios from 'axios';
import type { Event } from '../types/Event.ts';
import type { EventEnumType } from '../types/Event-enum-type.ts';
import { useTimeBreaker } from './useTimeBreaker.ts';

const baseUrl = window.location.origin + '/api/event';
const api = axios.create({
  baseURL: window.location.origin,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export function useEvents() {
  const events = ref<Event[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const { setBreak, getBreak } = useTimeBreaker();

  const handleFocus = (
    event: EventEnumType,
    description?: string | number,
    waiting?: number,
    breaking?: number
  ) => {
    const hash = event + '-' + description;
    const breakHash = getBreak(hash);
    if (!breakHash) {
      setBreak(
        hash,
        setTimeout(() => {
          addEvent(event, description ? description + '' : undefined);
        }, waiting ?? 300),
        breaking ?? 5000
      );
    }
  };

  const handleBlur = (event: EventEnumType, description?: string | number) => {
    const hash = event + '-' + description;
    const breakHash = getBreak(hash);
    if (breakHash) {
      clearTimeout(breakHash);
    }
  };

  const handleClick = async (
    eventId: EventEnumType,
    description?: string | number,
    breaking?: number
  ) => {
    const hash = eventId + '-' + description;
    const breakHash = getBreak(hash);
    if (!breakHash) {
      setBreak(hash, 1, breaking ?? 5000);
      addEvent(eventId, description ? description + '' : undefined);
    }
  };

  const fetchEvents = async () => {
    loading.value = true;
    error.value = null;

    try {
      events.value = (await api.get(baseUrl)).data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'Unknown error occurred';
      }
    } finally {
      loading.value = false;
    }
  };

  const addEvent = async (eventId: EventEnumType, description?: string) => {
    loading.value = true;
    error.value = null;
    try {
      await api.post(baseUrl, {
        eventId: eventId,
        description: description ? description + '' : undefined
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'Unknown error occurred';
      }
    } finally {
      loading.value = false;
    }
  };

  return {
    events,
    loading,
    error,
    fetchEvents,
    addEvent,
    handleFocus,
    handleBlur,
    handleClick
  };
}
