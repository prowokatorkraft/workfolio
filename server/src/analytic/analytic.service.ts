import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EventEntity } from '../../shared/entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EventService } from '../event/event.service';
import { UserGroup } from '../../shared/entities/user-group';
import { Event } from '../../shared/entities/event';
import { EventGroup } from '../../shared/entities/event-group';
import { getEventKey } from '../../shared/entities/event-enum-type';

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
  ): Promise<{ eventCount: number; groupCount: number; groups: UserGroup[] }> {
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

    const eGroups = new Array<UserGroup>();
    groups.forEach((events, userId) => {
      const eGroup = new UserGroup();
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
    return new Date(Date.UTC(year, month - 1, day, 23, 59, 59));
  }

  async getEvents(
    dateFrom?: string,
    dateTo?: string
  ): Promise<EventGroup[]> {
    const to = dateTo ? this.parseUTCDate(dateTo) : new Date();
    const from = dateFrom
      ? this.parseUTCDate(dateFrom)
      : new Date(new Date().setDate(new Date().getDate() - 1));

    const response = await this.eventRepository
      .createQueryBuilder('e')
      .where('e.createdAt BETWEEN :dateFrom AND :dateTo', {
        dateFrom: from,
        dateTo: to
      })
      .select(['e.event_id AS event_id', 'e.description AS description', 'COUNT(*) AS count'])
      .groupBy('e.event_id, e.description')
      .orderBy('COUNT(*)', 'DESC')
      .addOrderBy('e.event_id', 'ASC')
      .getRawMany();

    return response.map((r) => {
      const result = new EventGroup();
      result.id = r.event_id;
      result.name = getEventKey(r.event_id) ?? '';
      result.description = r.description;
      result.count = r.count;
      return result;
    });
  }
}
