import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { AnalyticService } from './analytic.service';
import { DevelopmentOnlyGuard } from '../../shared/guards/development-only.guard';
import { EventGroup } from '../../shared/entities/event-group';
import { AnalyticRequest } from '../../shared/entities/analytic-request.dto.';

@Controller('analytic')
@UseGuards(DevelopmentOnlyGuard)
export class AnalyticController {
  constructor(private readonly loggerService: AnalyticService) {}

  @Post('users')
  async getAnalyticUsers(
    @Body() request: AnalyticRequest
  ): Promise<{ eventCount: number; groups: EventGroup[] }> {
    return await this.loggerService.getUsers(
      request.dateFrom,
      request.dateTo,
      request.pageSize,
      request.page
    );
  }
}
