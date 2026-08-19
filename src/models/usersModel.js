// parte do backend responsável por fazer a comunicação com o banco de dados, realizando operações como criar, buscar e atualizar registros na tabela de usuários.

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

const list = async (params) => {
    console.log('3. são essas informações que chegaram no model:', params);
    const { 
        page = 1,
        name, 
        registration, 
        role,
        includeExcluded = false,
        //allowedUserIds
    } = params;

// define o limite de registros por página
    const limit = 20; 
    const offset = (page - 1) * limit;

// buscando no banco. 
    const query = db(TABLE_NAME).select('name', 'registration', 'role');
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
    query.where('role', role);
  }

//   if (allowedUserIds) {
//     query.whereIn('id', allowedUserIds);
//   }

  query.limit(limit).offset(offset);

  console.log('4. dados retornados do model:', await query.toString());

  return await query;
};

export default {
    create,
    findByEmail,
    findByCPF,
    findByRegistration,
    list
};

