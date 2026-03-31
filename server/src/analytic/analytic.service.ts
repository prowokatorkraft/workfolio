import { Injectable } from '@nestjs/common';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { EventEntity } from '../../shared/entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EventService } from '../event/event.service';
import { UserStatistics } from '../../shared/entities/user-statistics';

@Injectable()
export class AnalyticService {
  constructor(
    private readonly eventService: EventService,
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>
  ) {}

  async getUserStatistics(): Promise<UserStatistics> {
    const stat = new UserStatistics();
    stat.dayUserCount = await this.getUserCount('day');
    stat.threeDaysUserCount = await this.getUserCount('3days');
    stat.weekUserCount = await this.getUserCount('week');
    stat.monthUserCount = await this.getUserCount('month');
    stat.userCount = await this.getUserCount();
    return stat;
  }

  async getUserCount(period?: string): Promise<number> {
    let dateFilter: Date;
    const now = new Date();

    switch (period) {
      case 'day':
        dateFilter = new Date(now.setDate(now.getDate() - 1));
        break;
      case '3days':
        dateFilter = new Date(now.setDate(now.getDate() - 3));
        break;
      case 'week':
        dateFilter = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        dateFilter = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        dateFilter = new Date(0);
    }

    const response = await this.eventRepository
      .createQueryBuilder('event')
      .select('COUNT(DISTINCT event.userId)', 'count')
      .where('event.createdAt > :date', { date: dateFilter })
      .getRawMany();

    return response[0].count;
  }
}
