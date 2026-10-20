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
    const { page = 1, limit = 20, title, entity_code, loggedUser } = data;

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
        limit: normalizedLimit,
        title,
        entity_code
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

const deleteDepartment = async ({ id, loggedUser }) => {
    
    if (!loggedUser || loggedUser.role !== 'admin') {
        throw new Error('Não autorizado. Apenas administradores podem excluir departamentos.');
    }

    const department = await departmentsModel.findById(id);
    if (!department) {
        throw new Error('Departamento não encontrado.');
    }

    await departmentsModel.remove(id);

    return { message: 'Departamento e todos os seus vínculos foram excluídos com sucesso.' };
};

const addUserDepartment = async ({departmentId, userId, loggedUser}) =>{

    if(!loggedUser || loggedUser.role !== 'admin'){
        throw new Error('Não autorizado. Apenas administradores podem adicionar usuários no departamento.')
    }

    const department = await departmentsModel.findById(departmentId);
    if(!department){
        throw new Error('Departamento não encontrado.')
    }

    const user = await usersModel.findById(userId);
    if(!user){
        throw new Error('Usuário não encontrado.')
    }

    if(user.role !== 'coordinator'){
        throw new Error('Somente coordenadores poderão ser adicionados ao departamento.')
    }

    const userFromDepartment = await departmentsModel.queryUserDep(departmentId, userId);
    if(userFromDepartment){
        throw new Error('Este usuário já está vinculado a este departamento.')
    }

    await departmentsModel.addUserDep(departmentId, userId)

    return {message: 'Usuário vinculado ao departamento com sucesso.'}
}

const updateDepartment = async({id, title, entity_code, loggedUser}) =>{

    if(!loggedUser || loggedUser.role !== 'admin'){
        throw new Error('Não autorizado. Apenas administradores podem editar departamentos.')
    };

    if(title === undefined && entity_code === undefined){
        throw new Error('Pelo menos um campo deve ser informado para edição.')
    };

    const department = await departmentsModel.findById(id)

    if(!department){
        throw new Error('Departamento não encontrado.')
    }

    let normalizedTitle = title
    if(title !== undefined){
        if (typeof title !== 'string' || !title.trim()) {
            throw new Error('Nome do departamento é obrigatório.');
        };

        normalizedTitle = title.trim()
        if (normalizedTitle.length > 100) {
        throw new Error('Nome do departamento deve conter no máximo 100 caracteres.');
        }
    };
    
    let normalizedEntityCode = entity_code
    if(entity_code !== undefined){
        if(typeof entity_code !== 'string'){
            throw new Error('O código da entidade deve ser um texto')
        };
        normalizedEntityCode = entity_code.trim()

        const entityCodeRegex = /^[A-Z]{3}\d{2}(01|02)-\d$/;
        const isValidEntityCode = entityCodeRegex.test(normalizedEntityCode);
    
        if(isValidEntityCode === false){
       throw new Error('O código de entidade do departamento está no formato incorreto. ')
        };

        const entityCode = await departmentsModel.queryEntityCode(normalizedEntityCode)

        if(entityCode){
            if(entityCode.id !== id){
            throw new Error('O código de entidade já está em uso')
            }
        };   
    };

    await departmentsModel.update(id, normalizedTitle, normalizedEntityCode);

    return {message: 'Departamento editado com sucesso.'};
};

export default { 
    createDepartment,
    listDepartments,
    showDepartment,
    removeUserFromDepartment,
    deleteDepartment,
    addUserDepartment,
    updateDepartment
 };
