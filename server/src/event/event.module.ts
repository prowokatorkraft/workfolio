import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitorMiddleware } from '../../shared/middleware/visitor.middleware';
import { EventEntity } from '../../shared/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity])],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService]
})
export class EventModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VisitorMiddleware).forRoutes(EventController);
  }
}
