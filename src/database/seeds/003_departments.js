import { generateEntityCode } from '../../utils/generateEntityCode.js';

export async function seed(knex) {

    const admin = await knex('users').where({ role: 'admin' }).first();

    const departmentTitles = [
        'Engenharia de Software',
        'Ciência da Computação',
        'Sistemas de Informação',
        'Engenharia Civil',
        'Arquitetura e Urbanismo',
        'Design Gráfico',
        'Física Matemática',
        'Ciências Biológicas'
    ];

    
    const createdAt = new Date('2026-02-10T10:00:00Z');

    const departments = departmentTitles.map((title, index) => {
      
        const entityCode = generateEntityCode(title, createdAt, index);

        return {
            title: title,
            entity_code: entityCode,
            created_by: admin ? admin.id : null,
            created_at: createdAt,
            updated_at: createdAt
        };
    });

    
    await knex('departments')
        .insert(departments)
        .onConflict('entity_code')
        .ignore();
}