import db from '../database/connection.js';

const TABLE_NAME = 'departments';

const create = async (departmentData) => {
    const [newDepartment] = await db(TABLE_NAME)
        .insert(departmentData)
        .onConflict('entity_code').ignore()
        .returning('*');
    return newDepartment;
};

export default {
    create,
};
