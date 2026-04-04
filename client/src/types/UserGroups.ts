import type { UserGroup } from './UserGroup.ts';

export interface UserGroups {
  eventCount: number;
  groupCount: number;
  groups: UserGroup[];
}
