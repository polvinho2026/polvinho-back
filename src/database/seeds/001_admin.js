import bcrypt from 'bcrypt';

const ADMIN_REGISTRATION = '1000000001';

export async function seed(knex) {
    const password = await bcrypt.hash(ADMIN_REGISTRATION, 10);

    const admin = {
        name: 'Administrador Polvinho',
        email: 'admin@polvinho.com',
        cpf: '52998224725',
        birth_date: '1990-01-01',
        registration: ADMIN_REGISTRATION,
        role: 'admin',
        password,
        first_access: null,
        deleted_at: null
    };

    await knex('users')
        .insert(admin)
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
