/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.raw(`DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_types') THEN
                CREATE TYPE role_types AS ENUM ('admin', 'coordinator', 'professor', 'student');
            END IF;
        END $$;`)

    return knex.schema.createTable('users', (table) => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.string('name', 100).notNullable();
        table.string('email', 100).notNullable();
        table.specificType('cpf', 'char(11)').unique().notNullable();
        table.date('birth_date').notNullable();
        table.specificType('registration', 'char(10)').unique().notNullable();
        table.specificType('role', 'role_types').notNullable();
        table.timestamp('first_access').nullable();
        table.string('password', 255).notNullable();
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable().defaultTo(null);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists('users');

    await knex.raw(`DROP TYPE IF EXISTS role_types;`);
};
