import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req
} from '@nestjs/common';
import { EventService } from './event.service';
import Event from '../../shared/entities/event';
import { EventDto } from '../../shared/entities/event.dto';
import { ConfigService } from '@nestjs/config';

@Controller('event')
export class EventController {
  constructor(
    private readonly loggerService: EventService,
    private readonly configService: ConfigService
  ) {}

  @Get()
  async getEvents(): Promise<EventDto[]> {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    if (isProduction) {
      throw new ForbiddenException('Forbidden');
    }
    const events = await this.loggerService.getEvents();
    return Event.toDtos(events);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addEvent(@Req() request: Request, @Body() event: EventDto): Promise<void> {
    if (!event) {
      throw new BadRequestException('Event not found');
    }
    event.userId = request['visitorId'];
    if (!event.userId || event.userId == '') {
      throw new BadRequestException('UserId not found');
    }
    await this.loggerService.addEvent(Event.fromDto(event));
  }
}
