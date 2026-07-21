/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('attendances', (table) => {

        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.uuid('subject_id')
            .references('id')
            .inTable('subjects')
            .onDelete('CASCADE');
        table.uuid('created_by')
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
        table.string('title', 100).notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('deleted_at').nullable().defaultTo(null);
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists('attendances');
}
