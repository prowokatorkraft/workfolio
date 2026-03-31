import { AnalyticController } from './analytic.controller';
import { AnalyticService } from './analytic.service';
import { Module } from '@nestjs/common';
import { EventModule } from '../event/event.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from '../../shared/entities/event.entity';

@Module({
  imports: [EventModule, TypeOrmModule.forFeature([EventEntity])],
  controllers: [AnalyticController],
  providers: [AnalyticService]
})
export class AnalyticModule {}
