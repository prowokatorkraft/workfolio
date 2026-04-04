import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EventEntity } from '../../shared/entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EventService } from '../event/event.service';
import { UserStatistics } from '../../shared/entities/user-statistics';
import { EventGroup } from '../../shared/entities/event-group';
import { Event } from '../../shared/entities/event';

@Injectable()
export class AnalyticService {
  constructor(
    private readonly eventService: EventService,
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>
  ) {}

  async getUsers(
    dateFrom?: string,
    dateTo?: string,
    pageSize: number = 100,
    page: number = 1
  ): Promise<{ eventCount: number; groupCount: number; groups: EventGroup[] }> {
    const to = dateTo ? this.parseUTCDate(dateTo) : new Date();
    const from = dateFrom
      ? this.parseUTCDate(dateFrom)
      : new Date(new Date().setDate(new Date().getDate() - 1));

    const response = await this.eventRepository
      .createQueryBuilder('event')
      .where('event.createdAt BETWEEN :dateFrom AND :dateTo', {
        dateFrom: from,
        dateTo: to
      })
      .orderBy('event.createdAt', 'DESC')
      .getMany();

    const groups = new Map<string, EventEntity[]>();
    response.forEach((entity) => {
      const userId = entity.userId;
      if (!groups.has(userId)) {
        groups.set(userId, []);
      }
      groups.get(userId)!.push(entity);
    });

    const eGroups = new Array<EventGroup>();
    groups.forEach((events, userId) => {
      const eGroup = new EventGroup();
      eGroup.userId = userId;
      eGroup.eventCount = events.length;
      eGroup.events = Event.fromEntities(events);
      eGroups.push(eGroup);
    });

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const result = eGroups.slice(startIndex, endIndex);

    return { eventCount: response.length, groupCount: eGroups.length, groups: result };
  }

  parseUTCDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }
}
