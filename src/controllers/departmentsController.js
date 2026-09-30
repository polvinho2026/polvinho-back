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

export default { 
    create,
    list
};
