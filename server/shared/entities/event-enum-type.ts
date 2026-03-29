export const EventEnum = {
  none: 0,
  open: 1000,
} as const;

export type EventEnumType = (typeof EventEnum)[keyof typeof EventEnum];
