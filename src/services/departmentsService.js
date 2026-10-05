import departmentsModel from '../models/departmentsModel.js';
import { generateEntityCode } from '../utils/generateEntityCode.js';
import usersModel from '../models/usersModel.js';

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

const listDepartments = async (data) => {
    const { page = 1, limit = 20, loggedUser } = data;

    if (!loggedUser || (loggedUser.role !== 'admin' && loggedUser.role !== 'coordinator')) {
        throw new Error('Não autorizado. Apenas administradores e coordenadores podem listar departamentos.');
    }

    const normalizedPage = Number(page);
    let normalizedLimit = Number(limit);

    if (!Number.isInteger(normalizedPage) || normalizedPage < 1) {
        throw new Error('Página deve ser um número inteiro maior ou igual a 1.');
    }

    if (!Number.isInteger(normalizedLimit) || normalizedLimit < 1) {
        throw new Error('Limite deve ser um número inteiro válido.');
    }

    if (normalizedLimit > 20) {
        normalizedLimit = 20;
    }

    const departmentsData = await departmentsModel.list({
        page: normalizedPage,
        limit: normalizedLimit
    });

    return departmentsData;
};

const showDepartment = async ({ id, loggedUser }) => {
    if (!loggedUser || (loggedUser.role !== 'admin' && loggedUser.role !== 'coordinator')) {
        throw new Error('Não autorizado. Apenas administradores e coordenadores podem visualizar departamentos.');
    }

    const department = await departmentsModel.findById(id);
    if (!department) {
        throw new Error('Departamento não encontrado.');
    }

    const users = await departmentsModel.findUsersByDepartmentId(id);

    return { ...department, users };
};

const removeUserFromDepartment = async ({ departmentId, userId, loggedUser }) => {
    
    if (!loggedUser || loggedUser.role !== 'admin') {
        throw new Error('Não autorizado. Apenas administradores podem remover usuários de um departamento.');
    }

    
    const user = await usersModel.findById(userId);
    if (!user) {
        throw new Error('Usuário não encontrado.');
    }


    if (user.role !== 'coordinator') {
        throw new Error('Somente coordenadores poderão ser removidos de um departamento.');
    }

    await departmentsModel.removeUser(departmentId, userId);

    return { 
        message: 'Coordenador removido do departamento. Seus vínculos com cursos e disciplinas foram encerrados.' 
    };
};

export default { 
    createDepartment,
    listDepartments,
    showDepartment,
    removeUserFromDepartment
 };
