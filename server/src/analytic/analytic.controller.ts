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
import Event from '../../shared/entities/event';
import { EventDto } from '../../shared/entities/event.dto';
import { ConfigService } from '@nestjs/config';
import { DevelopmentOnlyGuard } from '../../shared/guards/development-only.guard';
import { UserStatistics } from '../../shared/entities/user-statistics';

@Controller('analytic')
@UseGuards(DevelopmentOnlyGuard)
export class AnalyticController {
  constructor(
    private readonly loggerService: AnalyticService,
    private readonly configService: ConfigService
  ) {}

  @Get('users')
  async getAnalyticUsers(): Promise<UserStatistics> {
    return await this.loggerService.getUserStatistics();
  }
}
