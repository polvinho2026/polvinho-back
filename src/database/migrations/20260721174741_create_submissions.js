/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up (knex) {
    return knex.schema.createTable('submissions', (table)=>{
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.uuid('id_assignment')
            .notNullable()
            .references('id')
            .inTable('assignments')
            .onDelete('CASCADE');
        table.text('description').nullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('deleted_at').nullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTable('submissions');
};
