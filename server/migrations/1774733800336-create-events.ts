import { type MigrationInterface, type QueryRunner, Table } from "typeorm";

export class CreateEvents1774733800336 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "event"`);
    await queryRunner.createTable(
      new Table({
        name: 'events',
        schema: 'event',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'user_id',
            type: 'varchar(200)'
          },
          {
            name: 'event_id',
            type: 'integer'
          }
        ]
      }),
      true
    );
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_events_user_id" 
      ON "event"."events" ("user_id")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_events_event_id" 
      ON "event"."events" ("event_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "event"."events" CASCADE`);

    await queryRunner.query(`
      DROP SCHEMA IF EXISTS "event" CASCADE
    `);
  }
}
