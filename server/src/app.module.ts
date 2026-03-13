import { ServeStaticModule } from '@nestjs/serve-static';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: false,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client', 'dist'), // путь к собранным файлам Vue
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('POSTGRES_HOST') ?? config.get('DB_HOST'),
        port: config.get('DB_PORT', 5432),
        username: config.get('POSTGRES_USER') ?? config.get('DB_USERNAME'),
        password: config.get('POSTGRES_PASSWORD') ?? config.get('DB_PASSWORD'),
        database: config.get('POSTGRES_DATABASE') ?? config.get('DB_NAME'),
        //entities: [],
        logging: true,
        namingStrategy: undefined,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
