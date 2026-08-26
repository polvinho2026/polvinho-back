import usersModel from '../models/usersModel.js';
import { validateCPF } from '../utils/validateCPF.js';
import bcrypt from 'bcrypt';

const createUser = async ({ name, email, cpf, birth_date, registration, role }) => {
    const allNames = name.split(' ');

    if (!allNames[1]) {
        throw new Error('Nome e sobrenome são obrigatórios.');
    };

    if (allNames[0].length < 3 || allNames[1].length < 3) {
        throw new Error('Nome e sobrenome devem conter 3 ou mais caracteres.');
    };

    if (registration.length !== 10) {
        throw new Error('Matrícula deve conter exatamente 10 dígitos.');
    };

    const emailExists = await usersModel.findByEmail(email);
    if (emailExists) {
        throw new Error('Este e-mail já está em uso.');
    };

    const cpfExists = await usersModel.findByCPF(cpf);
    if (cpfExists) {
        throw new Error('Este CPF já está cadastrado.')
    };

    const registrationExists = await usersModel.findByRegistration(registration);
    if (registrationExists) {
        throw new Error('Este número de matrícula já está em uso.');
    };

    if (!validateCPF(cpf)) {
        throw new Error('CPF inválido.');
    };

    const password = registration;
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await usersModel.create({
        name,
        email,
        cpf,
        birth_date,
        registration,
        role,
        password: passwordHash
    });

    return newUser;
};

const listUsers = async (data) => {
    const { page = 1, limit = 20, name, registration, role, includeExcluded, loggedUser } = data;

    const normalizedPage = Number(page);
    const normalizedLimit = Number(limit);

    if (!Number.isInteger(normalizedPage) || normalizedPage < 1) {
        throw new Error('Página deve ser um número inteiro maior ou igual a 1.');
    }

    if (!Number.isInteger(normalizedLimit) || normalizedLimit < 1 || normalizedLimit > 100) {
        throw new Error('Limite deve ser um número inteiro entre 1 e 100.');
    }

    let finalIncludeExcluded = false; 
    let allowedUserIds; 

    // restrição de acesso: apenas usuários com papel "admin" ou "coordinator" podem ver usuários excluídos ou todos os usuários.
    if (loggedUser.role === 'admin' || loggedUser.role === 'coordinator') {
        finalIncludeExcluded = includeExcluded === 'true' || includeExcluded === true;
    }

    else if (loggedUser.role === 'student' || loggedUser.role === 'professor') {
        finalIncludeExcluded = false;
    }

    const usersData = await usersModel.list({
        page: normalizedPage,
        limit: normalizedLimit,
        name,
        registration,
        role,
        includeExcluded: finalIncludeExcluded,
        allowedUserIds
    });

    return usersData;

}

const showUser = async ({ id, loggedUser }) => {
    // verificações para mostrar detalhes de um usuário
    // 1 - informações devem ser diferentes dependendo da role do requisitor
    if(!loggedUser) {
        throw new Error('Não autorizado.')
    }
    
    const userData = await usersModel.findById(id)

    if(!userData) {
        throw new Error('Usuário não encontrado.')
    }

    const { name, email, registration, role, birth_date, cpf, deleted_at } = userData

    if(loggedUser.role === 'student' || loggedUser.role === 'professor') {

        if (deleted_at) {
            throw new Error('Não autorizado.')
        }

        return {
            name,
            email,
            registration,
            role
        }

    }
    
    return {
        name,
        email,
        registration,
        role,
        birth_date,
        cpf,
        deleted_at
    }
}

export default {
    createUser,
    listUsers,
    showUser
};
