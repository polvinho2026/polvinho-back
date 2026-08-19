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
    const { page, name, registration, role, includeExcluded, loggedUser } = data;

    let finalIncludeExcluded = false; 
    let allowedUserIds; 

    // restrição de acesso: apenas usuários com papel "admin" ou "coordinator" podem ver usuários excluídos ou todos os usuários.
    if (loggedUser.role === 'admin' || loggedUser.role === 'coordinator') {
        finalIncludeExcluded = includeExcluded === 'true' || includeExcluded === true;
    }

    else if (loggedUser.role === 'student' || loggedUser.role === 'professor') {
        finalIncludeExcluded = false;
        // TODO: buscar IDs dos colegas. 
    }

    const usersData = await usersModel.list({
    page,
    name,
    registration,
    role,
    includeExcluded: finalIncludeExcluded,
    allowedUserIds
  });

  return usersData;

}




export default {
    createUser,
    listUsers
};