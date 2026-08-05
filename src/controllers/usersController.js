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

export default {
    create,
};