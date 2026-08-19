import usersService from "../services/usersService.js";
import { validateDateISO } from "../utils/validateDateISO.js";

const create = async (req, res) => {
    try {
        const { name, email, cpf, birth_date, registration, role } = req.body;

        if (!name || !email || !cpf || !birth_date || !registration || !role) {
            throw new Error('Nome, email, cpf, data de nascimento, matrícula, papel e senha são obrigatórios.');
        };

        if (!validateDateISO(birth_date)) {
            throw new Error('Data deve ser no formato YYYY-MM-DD.');
        };

        const newUser = await usersService.createUser({
            name,
            email,
            cpf,
            birth_date,
            registration,
            role
        });

        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    };
};

const list = async (req, res) => {
    try {
        console.log('1. são essas informações que chegaram do usuário externo que está solicitando a lista:', req);
        console.log('2. são essas informações que o usuário está me fornecendo', req.query);
        const { page, name, registration, role, includeExcluded } = req.query;
        const loggedUser = { id: 1, role: 'admin' }
        const users = await usersService.listUsers({
            page,
            name,
            registration,
            role,
            includeExcluded,
            loggedUser
        });
        console.log('5. são essas informações que chegaram do model para o controller:', users);
        return res.status(200).json(users);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

export default {
    create, 
    list,
};

