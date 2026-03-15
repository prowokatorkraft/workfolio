export interface WorkProject {
  id: number;
  period: string;
  duration: string;
  title: string;
  company: string;
  shortDescription: string;
  detailedDescription: string;
  technologies: string[];
  achievements: string[];
  isExpanded: boolean;
}