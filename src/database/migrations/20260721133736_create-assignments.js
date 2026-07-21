/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.createTable('assignments', (table) =>{
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.uuid('created_by')
            .nullable()
            .references('id')
            .inTable('users')
            .onDelete('SET NULL');
        table.uuid('id_subject')
            .notNullable()
            .references('id')
            .inTable('subjects')
            .onDelete('CASCADE');
        table.string('title', 100).notNullable();
        table.text('description').nullable();
        table.date('date_start').nullable();
        table.date('date_end').nullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('deleted_at').nullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTable('assignments');
};
