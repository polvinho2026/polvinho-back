import db from '../database/connection.js';

const TABLE_NAME = 'users';

const create = async (userData) => {
    const [newUser] = await db(TABLE_NAME).insert(userData).returning('*');
    return newUser;
};

const findByEmail = async (email) => {
    return await db(TABLE_NAME).where({ email }).first();
};

const findByCPF = async (cpf) => {
    return await db(TABLE_NAME).where({ cpf }).first();
};

const findByRegistration = async (cpf) => {
    return await db(TABLE_NAME).where({ cpf }).first();
};

export default {
    create,
    findByEmail,
    findByCPF,
    findByRegistration
};