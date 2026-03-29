import { type MigrationInterface, type QueryRunner, Table } from 'typeorm';

export class CreateEvents1774733800336 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
          },
          {
            name: 'description',
            type: 'varchar(200)',
            isNullable: true
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false
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

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_events_event_id_description" 
      ON "event"."events" ("event_id", "description")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "event"."events" CASCADE`);
  }
}
