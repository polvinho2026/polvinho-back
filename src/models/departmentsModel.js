import db from '../database/connection.js';

const TABLE_NAME = 'departments';

const create = async (departmentData) => {
    const [newDepartment] = await db(TABLE_NAME)
        .insert(departmentData)
        .onConflict('entity_code').ignore()
        .returning('*');
    return newDepartment;
};

const list = async (params) => {
    const { page = 1, limit = 20 } = params;
    const offset = (page - 1) * limit;

    const query = db(TABLE_NAME);

    const dataQuery = query
        .clone()
        .select('title', 'entity_code')
        .limit(limit)
        .offset(offset);

        const countQuery = query
        .clone()
        .count({ total: 'id' })
        .first();

        const [departments, countResult] = await Promise.all([dataQuery, countQuery]);
    
    const totalItems = Number(countResult.total);
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    return {
        data: departments,
        pagination: {
            page,
            limit,
            totalItems,
            totalPages
        }
    };
};

export default {
    create,
    list
};
