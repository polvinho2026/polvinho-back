/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('users_courses', (table) => {
    
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('course_id')
      .references('id')
      .inTable('courses')
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
  return knex.schema.dropTableIfExists('users_courses');
}