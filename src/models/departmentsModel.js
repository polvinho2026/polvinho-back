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
        .select('id', 'title', 'entity_code')
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

const removeUser = async (departmentId, userId) => {
    return await db.transaction(async (trx) => {
        const now = new Date();

        await trx('users_departments')
            .where({ department_id: departmentId, user_id: userId })
            .update({ deleted_at: now });

        const courses = await trx('courses')
            .select('id')
            .where({ department_id: departmentId })
            .whereNull('deleted_at');
        
        const courseIds = courses.map(c => c.id);

        if (courseIds.length > 0) {
            await trx('users_courses')
                .where({ user_id: userId })
                .whereIn('course_id', courseIds)
                .update({ deleted_at: now });

            const subjects = await trx('subjects')
                .select('id')
                .whereIn('course_id', courseIds)
                .whereNull('deleted_at');
                
            const subjectIds = subjects.map(s => s.id);

            if (subjectIds.length > 0) {
                await trx('users_subjects')
                    .where({ user_id: userId })
                    .whereIn('subject_id', subjectIds)
                    .update({ deleted_at: now });
            }
        }
        return true;
    });
};


export default {
    create,
    list,
    removeUser
};
