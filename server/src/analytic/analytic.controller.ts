import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticService } from './analytic.service';
import { DevelopmentOnlyGuard } from '../../shared/guards/development-only.guard';
import { UserGroup } from '../../shared/entities/user-group';
import { UserAnalyticRequest } from '../../shared/entities/user-analytic-request.dto.';
import { EventAnalyticRequest } from '../../shared/entities/event-analytic-request.dto.';
import { EventGroup } from '../../shared/entities/event-group';

@Controller('analytic')
@UseGuards(DevelopmentOnlyGuard)
export class AnalyticController {
  constructor(private readonly loggerService: AnalyticService) {}

  @Get('user')
  async getAnalyticUsers(
    @Query() request: UserAnalyticRequest
  ): Promise<{ eventCount: number; groups: UserGroup[] }> {
    return await this.loggerService.getUsers(
      request.dateFrom,
      request.dateTo,
      request.pageSize,
      request.page
    );
  }

  @Get('event')
  async getAnalyticEvents(@Query() request: EventAnalyticRequest): Promise<EventGroup[]> {
    return await this.loggerService.getEvents(request.dateFrom, request.dateTo);
  }
}
