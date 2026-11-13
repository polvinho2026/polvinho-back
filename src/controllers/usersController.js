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
            role,
            loggedUser: req.loggedUser
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
        
        const { page, limit, name, registration, role, includeExcluded } = req.query;
        
        
        const loggedUser = req.loggedUser;

        const users = await usersService.listUsers({
            page,
            limit,
            name,
            registration,
            role,
            includeExcluded,
            loggedUser
        });

        return res.status(200).json(users);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

const show = async (req, res) => {
    const { id } = req.params 

    const loggedUser = req.loggedUser;

    try {
        const userData = await usersService.showUser({id, loggedUser})
    
        return res.status(200).json(userData)
    } catch(error) {
        return res.status(400).json({
            message: error.message
        })
    }

}

const update = async (req, res) => {

    try {
    const { id } = req.params 
    const { name, email, cpf, birth_date, registration, role } = req.body;

    const loggedUser = req.loggedUser;

    const updatedUser = await usersService.updateUser({
            id,
            loggedUser,
            name,
            email,
            cpf,
            birth_date,
            registration,
            role
        });

    return res.status(200).json(updatedUser);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;

        const loggedUser = req.loggedUser;
        
        const result = await usersService.deleteUser({ id, loggedUser });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

export default {
    create, 
    list,
    show,
    update,
    remove 
};
