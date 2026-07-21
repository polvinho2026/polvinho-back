/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.raw(`DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'type_attachable') THEN
                CREATE TYPE type_attachable AS ENUM ('assignment', 'material', 'submission');
            END IF;
                
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'type_attachment') THEN
                CREATE TYPE type_attachment AS ENUM ('file', 'external_link');
            END IF;
        END $$;`);

    return knex.schema.createTable('attachments', (table) =>{
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.uuid('created_by')
            .nullable()
            .references('id')
            .inTable('users')
            .onDelete('SET NULL');
        table.uuid('id_attachable').notNullable()
        table.specificType('attachable_type', 'type_attachable').notNullable();
        table.specificType('attachment_type', 'type_attachment').notNullable();
        table.string('base_url', 2048).nullable();
        table.string('path', 2048).nullable();
        table.string('external_link', 2048).nullable();
        table.bigInteger('file_size').nullable();
        table.string('file_extension', 10).nullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('deleted_at').nullable();
        table.index(['id_attachable', 'attachable_type']);     
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTable('attachments');

    await knex.raw(`DROP TYPE IF EXISTS type_attachable`);

    await knex.raw(`DROP TYPE IF EXISTS type_attachment`);
};
