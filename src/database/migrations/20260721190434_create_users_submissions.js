/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.createTable('users_submissions', (table)=>{
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.uuid('id_submission')
            .notNullable()
            .references('id')
            .inTable('submissions')
            .onDelete('CASCADE');
        table.uuid('id_user')
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
        table.decimal('grade', { precision: 4, scale: 2}).nullable();
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
    return knex.schema.dropTable('users_submissions');
};
