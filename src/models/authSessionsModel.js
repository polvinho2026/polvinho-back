import db from '../database/connection.js';

const TABLE_NAME = 'auth_sessions';

const create = async (sessionData) => {
    const [session] = await db(TABLE_NAME)
        .insert(sessionData)
        .returning('*');

    return session;
};

const findById = async (id) => {
    return db(TABLE_NAME)
        .where({ id })
        .first();
};

const revoke = async (id) => {
    return db(TABLE_NAME)
        .where({ id })
        .whereNull('revoked_at')
        .update({
            revoked_at: db.fn.now()
        });
};

export default {
    create,
    findById,
    revoke
};