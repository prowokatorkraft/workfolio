import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTimestampColumnsAndDesc1774743298317 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn(
        'event.events',
        new TableColumn({
          name: 'created_at',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP',
          isNullable: false
        })
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn('event.events', 'created_at');
    }

}
