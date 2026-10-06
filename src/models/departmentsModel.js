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

    const query = db(TABLE_NAME).whereNull('deleted_at');

    const dataQuery = query
        .clone()
        .select('id', 'title', 'entity_code')
        .orderBy('title', 'asc')
        .orderBy('id', 'asc')
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

const findById = async (id) => {
    return await db(TABLE_NAME)
        .where({ id })
        .whereNull('deleted_at')
        .select('id', 'title', 'entity_code')
        .first();
};

const findUsersByDepartmentId = async (departmentId) => {
    return await db('users')
        .join('users_departments', 'users.id', 'users_departments.user_id')
        .where('users_departments.department_id', departmentId)
        .whereNull('users_departments.deleted_at')
        .whereNull('users.deleted_at')
        .distinct('users.id', 'users.name', 'users.email', 'users.registration', 'users.role')
        .orderBy('users.name', 'asc')
        .orderBy('users.id', 'asc');
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

const remove = async (id) => {
    return await db.transaction(async (trx) => {
        const now = new Date();

    
        await trx(TABLE_NAME)
            .where({ id })
            .update({ deleted_at: now });

        
        await trx('users_departments')
            .where({ department_id: id })
            .update({ deleted_at: now });

        
        const courses = await trx('courses')
            .select('id')
            .where({ department_id: id })
            .whereNull('deleted_at');

        const courseIds = courses.map(c => c.id);

        if (courseIds.length > 0) {
           
            await trx('courses')
                .whereIn('id', courseIds)
                .update({ deleted_at: now });

            
            await trx('users_courses')
                .whereIn('course_id', courseIds)
                .update({ deleted_at: now });

            
            const subjects = await trx('subjects')
                .select('id')
                .whereIn('course_id', courseIds)
                .whereNull('deleted_at');

            const subjectIds = subjects.map(s => s.id);

            if (subjectIds.length > 0) {
                await trx('subjects')
                    .whereIn('id', subjectIds)
                    .update({ deleted_at: now });

                await trx('users_subjects')
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
    findById,
    findUsersByDepartmentId,
    removeUser,
    remove
};
