import type { EventEnumType } from './Event-enum-type.ts';

export interface Event {
  id?: number;
  eventId: EventEnumType;
  description?: string;
}