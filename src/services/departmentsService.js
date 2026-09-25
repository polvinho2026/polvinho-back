import departmentsModel from '../models/departmentsModel.js';
import { generateEntityCode } from '../utils/generateEntityCode.js';

const createDepartment = async ({ title }) => {
    if (typeof title !== 'string' || !title.trim()) {
        throw new Error('Nome do departamento é obrigatório.');
    }

    const normalizedTitle = title.trim();
    if (normalizedTitle.length > 100) {
        throw new Error('Nome do departamento deve conter no máximo 100 caracteres.');
    }

    const createdAt = new Date();
    for (let digit = 0; digit <= 9; digit++) {
        const entityCode = generateEntityCode(normalizedTitle, createdAt, digit);
        const department = await departmentsModel.create({
            title: normalizedTitle,
            entity_code: entityCode,
            created_at: createdAt
        });
        if (department) return department;
    }

    throw new Error('Todos os dígitos de 0 a 9 para este prefixo, ano e semestre já estão em uso.');
};

export default { createDepartment };
