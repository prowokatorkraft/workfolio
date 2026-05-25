export const TechnologyGroup = {
  none: 0,
  backend: 1,
  frontend: 2,
  data: 3,
  tools: 4,
  language: 5,
  methodology: 6,
} as const;

export type TechnologyGroupType = (typeof TechnologyGroup)[keyof typeof TechnologyGroup];

export interface Technology {
  id: number;
  name: string;
  level?: number;
  group: TechnologyGroupType;
}
