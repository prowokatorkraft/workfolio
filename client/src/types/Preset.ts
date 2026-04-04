export interface Preset {
  label: string;
  value: string;
  getRange: () => { startDate: string; endDate: string };
}
