import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn } from 'typeorm';
import { type EventEnumType } from './event-enum-type';

@Entity({ name: 'events', schema: 'event' })
export class EventEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Index()
  @Column({
    name: 'user_id',
    type: 'varchar',
    length: 200,
    nullable: false
  })
  userId: string;

  @Index()
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
}
