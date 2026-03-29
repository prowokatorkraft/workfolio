import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn } from 'typeorm';
import { type EventEnumType } from './event-enum-type';

@Entity({ name: 'events', schema: 'event' })
@Index('idx_events_event_id_description', ['eventId', 'description'])
export class EventEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Index('idx_events_user_id')
  @Column({
    name: 'user_id',
    type: 'varchar',
    length: 200,
    nullable: false
  })
  userId: string;

  @Index('idx_events_event_id')
  @Column({
    name: 'event_id',
    type: 'integer'
  })
  eventId: EventEnumType;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt?: Date;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 200,
    nullable: true
  })
  description?: string;
}
