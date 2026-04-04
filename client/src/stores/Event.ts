import type { Event } from '../types/Event.ts';
import type { EventEnumType } from '../types/Event-enum-type.ts';
import { useTimeBreaker } from '../composables/useTimeBreaker.ts';
import { useApi } from '../composables/useApi.ts';
import { defineStore } from 'pinia';


export const useEventStore = defineStore('event', () => {
  const events = useApi<Event[]>([]);
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
          addEvent(event);
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
      addEvent(eventId);
    }
  };

  const fetchEvents = async () => {
    events.get('event', {});
  };

  const addEvent = async (eventId: EventEnumType, description?: string) => {
    events.post('event', {
      eventId: eventId,
      description: description ? description + '' : undefined
    });
  };

  return {
    events: events.data,
    loading: events.loading,
    error: events.error,

    handleFocus,
    handleBlur,
    handleClick,

    fetchEvents,
    addEvent
  };
});
