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

export default { create };
