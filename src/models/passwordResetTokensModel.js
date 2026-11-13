import db from '../database/connection.js';

const TABLE_NAME = 'password_reset_tokens';

const create = async (data) => {
    const [tokenRecord] = await db(TABLE_NAME)
        .insert(data)
        .returning('*');
    return tokenRecord;
};

const findByToken = async (token_hash) => {
    return await db(TABLE_NAME)
        .where({ token_hash })
        .first();
};

const markAsUsed = async (id) => {
    return await db(TABLE_NAME)
        .where({ id })
        .update({ used_at: db.fn.now() });
};

export default {
    create,
    findByToken,
    markAsUsed
};