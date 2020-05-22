import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateOrdersProducts1590090687173 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'orders_products',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'product_id',
            type: 'uuid',
          },
          {
            name: 'order_id',
            type: 'uuid',
          },
          {
            name: 'quantity',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 18,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'fk_orders_products_order',
            referencedTableName: 'orders',
            referencedColumnNames: ['id'],
            columnNames: ['order_id'],
            onDelete: 'cascade',
            onUpdate: 'cascade',
          },
          {
            name: 'fk_orders_products_product',
            referencedTableName: 'products',
            referencedColumnNames: ['id'],
            columnNames: ['product_id'],
            onDelete: 'cascade',
            onUpdate: 'cascade',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('orders_products');
  }
}
