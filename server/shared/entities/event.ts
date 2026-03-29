import type { EventEnumType } from './event-enum-type';
import { EventEntity } from './event.entity';
import { EventDto } from './event.dto';

export class Event {
  id?: number;

  userId: string;

  eventId: EventEnumType;

  static fromEntity(event: EventEntity): Event {
    const dto = new Event();
    dto.id = event.id ?? 0;
    dto.userId = event.userId;
    dto.eventId = event.eventId;
    return dto;
  }

  static fromEntities(events: EventEntity[]): Event[] {
    return events.map((note) => Event.fromEntity(note));
  }

  static toEntity(event: Event): EventEntity {
    const node = new EventEntity();
    node.id = event.id ?? 0;
    node.userId = event.userId;
    node.eventId = event.eventId;
    return node;
  }

  static toEntities(event: Event[]): EventEntity[] {
    return event.map((note) => Event.toEntity(note));
  }

  static fromDto(event: EventDto): Event {
    const dto = new Event();
    dto.id = event.id ?? 0;
    dto.userId = event.userId;
    dto.eventId = event.eventId;
    return dto;
  }

  static fromDtos(events: EventDto[]): Event[] {
    return events.map((note) => Event.fromDto(note));
  }

  static toDto(event: Event): EventDto {
    const node = new EventDto();
    node.id = event.id ?? 0;
    node.userId = event.userId;
    node.eventId = event.eventId;
    return node;
  }

  static toDtos(event: Event[]): EventDto[] {
    return event.map((note) => Event.toDto(note));
  }
}