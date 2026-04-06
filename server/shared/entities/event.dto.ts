import { EventEnum, type EventEnumType } from './event-enum-type';
import { IsIn, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class EventDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @MaxLength(200, { message: 'UserId must be less than 201 characters long' })
  userId?: string | undefined;

  @IsNumber()
  @Min(1, { message: 'EventId must be more than -1' })
  @IsIn(Object.values(EventEnum), {
    message: `EventId must be one of: ${Object.values(EventEnum).join(', ')}`
  })
  eventId: EventEnumType;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Description must be less than 201 characters long' })
  description?: string;
}
