import type { EventEnumType } from './Event-enum-type.ts';

export interface Event {
  id?: number;
  userId: string;
  eventId: EventEnumType;
  eventName?: string | undefined;
  createdAt?: Date;
  description?: string;
}
