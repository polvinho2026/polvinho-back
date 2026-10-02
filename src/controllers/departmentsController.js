import departmentsService from '../services/departmentsService.js';

const create = async (req, res) => {
    try {
        const { title } = req.body;
        const newDepartment = await departmentsService.createDepartment({ title });
        return res.status(201).json(newDepartment);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const list = async (req, res) => {
    try {
        const { page, limit } = req.query; 

        const loggedUser = { id: 'id-ficticio', role: 'admin' }; 

        const departments = await departmentsService.listDepartments({
            page,
            limit,
            loggedUser
        });

        return res.status(200).json(departments);
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

const removeUser = async (req, res) => {
    try {
        const { id: departmentId, userId } = req.params;
        
        const loggedUser = { id: 'id-ficticio-do-admin', role: 'admin' }; //simulação de usuário logado

        const result = await departmentsService.removeUserFromDepartment({
            departmentId,
            userId,
            loggedUser
        });

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
    removeUser
};
