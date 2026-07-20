/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('subjects', (table) => {
    
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('course_id')
      .references('id')
      .inTable('courses')
      .onDelete('CASCADE'); 
      
    table.string('title', 100).notNullable();
    table.specificType('entity_code', 'char(9)').unique().notNullable();
    table.uuid('created_by')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL'); 

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
  return knex.schema.dropTableIfExists('subjects');
}