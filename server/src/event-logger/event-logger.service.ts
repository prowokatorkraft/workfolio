import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EventEntity } from '../../shared/entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import Event from '../../shared/entities/event';

@Injectable()
export class EventLoggerService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(EventEntity)
    private notesRepository: Repository<EventEntity>
  ) {}

  async getEvents(): Promise<Event[]> {
    const entities = await this.notesRepository.find();
    return (entities?.length ?? 0) > 0 ? Event.fromEntities(entities) : [];
  }

  async addEvent(event: Event): Promise<void> {
    await this.notesRepository.save(Event.toEntity(event));
  }
}
