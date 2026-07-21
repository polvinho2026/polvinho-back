/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('users_attendances', (table) => {

        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.uuid('attendance_id')
            .references('id')
            .inTable('attendances')
            .onDelete('CASCADE');

        table.uuid('user_id')
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');

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
    return knex.schema.dropTableIfExists('users_attendances');
}