export interface Certificate {
  id: number;
  icon: string;
  name: string;
  issuer: string;
  date: string;
  hours?: number;
  credentialId?: string;
  credentialLink?: string;
  skills: string[];
  courseLink?: string;
  repo?: string;
  petProjectId?: number;
}