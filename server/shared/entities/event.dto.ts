import type { EventEnumType } from './event-enum-type';

export class EventDto {
  id?: number;

  userId: string;

  eventId: EventEnumType;
}