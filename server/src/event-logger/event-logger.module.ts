import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventLoggerController } from './event-logger.controller';
import { EventLoggerService } from './event-logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitorMiddleware } from '../../shared/middleware/visitor.middleware';
import { EventEntity } from '../../shared/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity])],
  controllers: [EventLoggerController],
  providers: [EventLoggerService]
})
export class EventLoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VisitorMiddleware).forRoutes(EventLoggerController);
  }
}
