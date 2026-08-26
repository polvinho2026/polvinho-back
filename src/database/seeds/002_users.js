import bcrypt from 'bcrypt';

const names = [
    'Ana Souza',
    'Bruno Lima',
    'Carla Mendes',
    'Daniel Rocha',
    'Eduarda Alves',
    'Felipe Costa',
    'Gabriela Martins',
    'Henrique Santos',
    'Isabela Ferreira',
    'João Oliveira',
    'Karen Ribeiro',
    'Lucas Barbosa',
    'Mariana Gomes',
    'Nicolas Cardoso',
    'Olivia Monteiro',
    'Paulo Nascimento',
    'Quezia Freitas',
    'Rafael Moreira',
    'Sabrina Castro',
    'Thiago Correia',
    'Ursula Teixeira',
    'Victor Fernandes',
    'Wesley Araújo',
    'Yasmin Carvalho',
    'Alice Batista',
    'Caio Moura',
    'Elisa Vieira',
    'Gustavo Pires',
    'Helena Duarte',
    'Igor Rezende'
];

const roles = [
    'admin',
    'admin',
    'coordinator',
    'coordinator',
    'coordinator',
    'coordinator',
    'professor',
    'professor',
    'professor',
    'professor',
    'professor',
    'professor',
    'professor',
    'professor',
    'professor',
    'professor',
    'student',
    'student',
    'student',
    'student',
    'student',
    'student',
    'student',
    'student',
    'student',
    'student',
    'student',
    'student',
    'student',
    'student'
];

function generateCPF(baseNumber) {
    const base = String(baseNumber).padStart(9, '0').slice(-9);
    const digits = base.split('').map(Number);

    const calculateDigit = (cpfDigits, initialWeight) => {
        const sum = cpfDigits.reduce((total, digit, index) => {
            return total + digit * (initialWeight - index);
        }, 0);

        const remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    };

    const firstDigit = calculateDigit(digits, 10);
    const secondDigit = calculateDigit([...digits, firstDigit], 11);

    return `${base}${firstDigit}${secondDigit}`;
}

export async function seed(knex) {
    const users = await Promise.all(names.map(async (name, index) => {
        const position = index + 1;
        const registration = String(2000000000 + position);
        const password = await bcrypt.hash(registration, 10);
        const month = String((index % 12) + 1).padStart(2, '0');
        const day = String((index % 28) + 1).padStart(2, '0');

        return {
            name,
            email: `usuario${String(position).padStart(2, '0')}@polvinho.com`,
            cpf: generateCPF(700000000 + position),
            birth_date: `${1980 + (index % 25)}-${month}-${day}`,
            registration,
            role: roles[index],
            password,
            first_access: null,
            deleted_at: null
        };
    }));

    await knex('users')
        .insert(users)
        .onConflict('registration')
        .merge([
            'name',
            'email',
            'cpf',
            'birth_date',
            'role',
            'password',
            'first_access',
            'deleted_at'
        ]);
}
