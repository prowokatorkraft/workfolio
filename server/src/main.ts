import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config({
    path: '.env',
  });
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
  console.info(process.env.POSTGRES_HOST);
  console.info(process.env.POSTGRES_USER);
  console.info(process.env.POSTGRES_PASSWORD);
}
bootstrap();
