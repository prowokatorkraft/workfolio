export interface PetProject {
  id: number;
  name: string;
  year: string;
  description: string;
  techStack: string[];
  features?: string[];
  repo: string;
  demo?: string;
}