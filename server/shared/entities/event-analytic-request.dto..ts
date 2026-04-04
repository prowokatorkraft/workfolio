import { IsDateString, IsOptional } from 'class-validator';

export class EventAnalyticRequest {
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;
}