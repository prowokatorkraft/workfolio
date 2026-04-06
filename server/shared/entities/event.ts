import { EventEnumType, getEventKey } from './event-enum-type';
import { EventEntity } from './event.entity';
import { EventDto } from './event.dto';

export class Event {
  id?: number;
  userId: string;
  eventId: EventEnumType;
  eventName?: string | undefined;
  createdAt?: Date;
  description?: string;

  static fromEntity(entity: EventEntity): Event {
    const event = new Event();
    event.id = entity.id ?? 0;
    event.userId = entity.userId;
    event.eventId = entity.eventId;
    event.eventName = getEventKey(entity.eventId);
    event.createdAt = entity.createdAt;
    event.description = entity.description;
    return event;
  }

  static fromEntities(events: EventEntity[]): Event[] {
    if (events.length === 0) {
      return [];
    }
    return events.map((note) => Event.fromEntity(note));
  }

  static toEntity(event: Event): EventEntity {
    const entity = new EventEntity();
    entity.id = event.id ?? 0;
    entity.userId = event.userId;
    entity.eventId = event.eventId;
    entity.createdAt = event.createdAt;
    entity.description = event.description;
    return entity;
  }

  static toEntities(events: Event[]): EventEntity[] {
    if (events.length === 0) {
      return [];
    }
    return events.map((note) => Event.toEntity(note));
  }

  static fromDto(dto: EventDto): Event {
    const event = new Event();
    event.id = dto.id ?? 0;
    event.userId = dto.eventId ? (dto.userId as string) : '';
    event.eventId = dto.eventId;
    event.createdAt = dto.createdAt;
    event.description = dto.description;
    return event;
  }

  static fromDtos(events: EventDto[]): Event[] {
    if (events.length === 0) {
      return [];
    }
    return events.map((note) => Event.fromDto(note));
  }

  static toDto(event: Event): EventDto {
    const dto = new EventDto();
    dto.id = event.id ?? 0;
    dto.userId = event.userId;
    dto.eventId = event.eventId;
    dto.createdAt = event.createdAt;
    dto.description = event.description;
    return dto;
  }

  static toDtos(events: Event[]): EventDto[] {
    if (events.length === 0) {
      return [];
    }
    return events.map((note) => Event.toDto(note));
  }
}
