export interface Project {
  id: number;
  periodStart: string;
  periodEnd?: string | undefined;
  title: string;
  company: string;
  shortDescription: string;
  detailedDescription: string;
  technologyIds: number[];
  achievements: string[];
  isExpanded: boolean;
}