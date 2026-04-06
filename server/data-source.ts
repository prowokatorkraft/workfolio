import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '.env.local') });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['./shared/entities/!**!/!*.entity{.ts,.js}'],
  migrations: ['./migrations/**/*{.ts,.js}'],
  schema: 'event',
  synchronize: false,
  logging: true,
  ssl: process.env.DB_SSL === 'true'
});
