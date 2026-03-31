import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EventEntity } from '../../shared/entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import Event from '../../shared/entities/event';

@Injectable()
export class EventService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>
  ) {}

  async getEvents(): Promise<Event[]> {
    const entities = await this.eventRepository.find();
    return (entities?.length ?? 0) > 0 ? Event.fromEntities(entities) : [];
  }

  async addEvent(event: Event): Promise<void> {
    await this.eventRepository.save(Event.toEntity(event));
  }
}
