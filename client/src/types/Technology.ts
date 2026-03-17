export const TechnologyGroup = {
  none: 0,
  backend: 1,
  frontend: 2,
  data: 3
} as const;

export type TechnologyGroupType = (typeof TechnologyGroup)[keyof typeof TechnologyGroup];

export interface Technology {
  id: number;
  name: string;
  level: number;
  group: TechnologyGroupType;
}