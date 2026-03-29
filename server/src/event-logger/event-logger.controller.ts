import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { EventLoggerService } from './event-logger.service';
import { EventEnum, type EventEnumType } from '../../shared/entities/event-enum-type';
import { Event } from '../../shared/entities/event';
import { EventDto } from '../../shared/entities/event.dto';

@Controller('logger')
export class EventLoggerController {
  constructor(private readonly loggerService: EventLoggerService) {}

  @Get()
  async getEvents(): Promise<EventDto[]> {
    const events = await this.loggerService.getEvents();
    return Event.toDtos(events);
  }

  @Post(':event')
  async addEvent(@Param('event') event: EventEnumType, @Req() request: Request): Promise<void> {
    const visitorId = request['visitorId'];
    const eventId = event as EventEnumType;

    await this.loggerService.addEvent(eventId, visitorId);
  }
}
