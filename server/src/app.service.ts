import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private dataSource: DataSource) {}
  async getHello(): Promise<string> {
    const result = await this.dataSource.query<{ version: string }[]>('SELECT version()');
    return result[0].version;
  }
}
