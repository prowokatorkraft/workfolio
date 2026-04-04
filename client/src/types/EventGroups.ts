import type { EventGroup } from './EventGroup.ts';

export interface EventGroups {
  eventCount: number;
  groupCount: number;
  groups: EventGroup[];
}
