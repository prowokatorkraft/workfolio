import type { Event } from './Event';

export interface UserGroup {
  userId: string;
  eventCount: number;
  events: Event[];
}
