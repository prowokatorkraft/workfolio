import { ServeStaticModule } from '@nestjs/serve-static';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventLoggerModule } from './event-logger/event-logger.module';
import { EventEntity } from '../shared/entities/event.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
      ignoreEnvFile: false
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'client', 'dist') // путь к собранным файлам Vue
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const isProduction = config.get('NODE_ENV') === 'production';
        return {
          type: 'postgres',
          host: config.get('POSTGRES_HOST') ?? config.get('DB_HOST'),
          port: config.get('DB_PORT', 5432),
          username: config.get('POSTGRES_USER') ?? config.get('DB_USERNAME'),
          password: config.get('POSTGRES_PASSWORD') ?? config.get('DB_PASSWORD'),
          database: config.get('POSTGRES_DATABASE') ?? config.get('DB_NAME'),
          entities: [EventEntity],
          namingStrategy: undefined,
          logging: config.get('NODE_ENV') === 'development',
          ssl: isProduction ? { rejectUnauthorized: false } : false,
          extra: isProduction ? { ssl: { rejectUnauthorized: false } } : undefined,
          poolSize: 5,
          connectTimeoutMS: 10000,
          maxQueryExecutionTime: 30000,
          synchronize: false,
          migrationsRun: false
        };
      },
      inject: [ConfigService]
    }),
    EventLoggerModule
  ]
})
export class AppModule {}
