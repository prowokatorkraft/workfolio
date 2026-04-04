import type { Event } from './Event';

export interface EventGroup {
  userId: string;
  eventCount: number;
  events: Event[];
}
