import { IsNumber, IsOptional, Min } from 'class-validator';

export class AnalyticRequest {
  @IsOptional()
  dateFrom?: string;

  @IsOptional()
  dateTo?: string;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Page must be more than 0' })
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'PageSize must be more than 0' })
  pageSize?: number;
}