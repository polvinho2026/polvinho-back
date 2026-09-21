import db from '../database/connection.js';

const TABLE_NAME = 'users';

const create = async (userData) => {
    const [newUser] = await db(TABLE_NAME).insert(userData).returning('*');
    return newUser;
};

const findById = async (id) => {
    return await db(TABLE_NAME).where({ id }).first()
}

const findByEmail = async (email) => {
    return await db(TABLE_NAME).where({ email }).first();
};

const findByCPF = async (cpf) => {
    return await db(TABLE_NAME).where({ cpf }).first();
};

const findByRegistration = async (registration) => {
    return await db(TABLE_NAME).where({ registration }).first();
};

const findColleaguesIds = async (userId) => {
    const userSubjectsQuery = db('users_subjects')
         .select('subject_id')
         .where('user_id', userId)
         .whereNull('deleted_at');

    const colleagues = await db('users_subjects')
        .distinct('user_id')
        .whereIn('subject_id', userSubjectsQuery)
        .whereNull('deleted_at');
    
    return colleagues.map(colleague => colleague.user_id);
};


const list = async (params) => {
    const { 
        page = 1,
        limit = 20,
        name, 
        registration, 
        role,
        includeExcluded = false,
        allowedUserIds
    } = params;

    const offset = (page - 1) * limit;

    const query = db(TABLE_NAME);

    if (!includeExcluded) {
        query.whereNull('deleted_at'); 
    }

    if (name) {
        query.where('name', 'ilike', `%${name}%`); 
    }

    if (registration) {
            query.where('registration', 'ilike', `%${registration}%`);
        }

    if (role) {
            const rolesArray = role.split(',');
            query.whereIn('role', rolesArray);
        }

  if (allowedUserIds) {
            query.whereIn('id', allowedUserIds);
        }

    const usersQuery = query
        .clone()
        .select('id', 'name', 'email', 'registration', 'role')
        .orderBy('name', 'asc')
        .orderBy('id', 'asc')
        .limit(limit)
        .offset(offset);

    const countQuery = query
        .clone()
        .count({ total: 'id' })
        .first();

    const [users, countResult] = await Promise.all([usersQuery, countQuery]);
    const totalItems = Number(countResult.total);
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    return {
        data: users,
        pagination: {
            page,
            limit,
            totalItems,
            totalPages
        }
    };
};

const update = async (id, userData) => {

    const [updatedUser] = await db(TABLE_NAME)
        .where({ id })
        .update(userData)
        .returning('*');
    
    return updatedUser;
};

const findCourseByUserId = async (userId) => {
    return await db('courses')
        .join('users_courses', 'courses.id', 'users_courses.course_id')
        .where('users_courses.user_id', userId)
        .whereNull('users_courses.deleted_at')
        .select('courses.title')
        .first();
};

const findSubjectsByUserId = async (userId) => {
    return await db('subjects')
        .join('users_subjects', 'subjects.id', 'users_subjects.subject_id')
        .where('users_subjects.user_id', userId)
        .whereNull('users_subjects.deleted_at')
        .select('subjects.id', 'subjects.title');
};

const remove = async (id) => {
    return await db.transaction(async (trx) => {
        const now = new Date();

        await trx(TABLE_NAME)
            .where({ id })
            .update({ deleted_at: now });

        await trx('users_departments')
            .where({ user_id: id })
            .update({ deleted_at: now });

        await trx('users_courses')
            .where({ user_id: id })
            .update({ deleted_at: now });

        await trx('users_subjects')
            .where({ user_id: id })
            .update({ deleted_at: now });

        return true;
    });
};

export default {
    create,
    findById,
    findByEmail,
    findByCPF,
    findByRegistration,
    findColleaguesIds,
    list,
    update,
    remove, 
    findCourseByUserId,
    findSubjectsByUserId
};
