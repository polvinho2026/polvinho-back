import bcrypt from 'bcrypt'; 
import { sendPasswordResetEmail } from './mailService.js';
import usersModel from '../models/usersModel.js'; 
import authSessionsModel from '../models/authSessionsModel.js';
import { signToken } from '../utils/jwt.js';
import crypto from 'node:crypto'; 
import passwordResetTokensModel from '../models/passwordResetTokensModel.js';

const INVALID_CREDENTIALS = 'Não foi possível entrar com as credenciais informadas.';


const dummyPasswordHash = await bcrypt.hash('comparacao-interna-sem-conta', 10);

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}


const validateCredentials = async ({ identifier, password }) => {
    if (!identifier || !password) {
        throw createError('Informe e-mail ou CPF e senha.', 400);
    }

    const user = await usersModel.findByIdentifier(identifier);
    const passwordHash = user ? user.password : dummyPasswordHash;
    const passwordMatches = await bcrypt.compare(password, passwordHash);

    if (!user || !passwordMatches || user.deleted_at !== null) {
        throw createError(INVALID_CREDENTIALS, 401);
    }

    return {
        user: { id: user.id, name: user.name, role: user.role },
        requiresPasswordChange: user.first_access === null 
    };
};

const login = async ({ identifier, password }) => {
    const { user, requiresPasswordChange } = await validateCredentials({ identifier, password });

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    const session = await authSessionsModel.create({
        user_id: user.id,
        csrf_token: 'vanilla-csrf-token', 
        expires_at: expiresAt
    });

    const now = Math.floor(Date.now() / 1000);
    const token = signToken({
        sub: user.id,
        jti: session.id,
        role: user.role,
        iat: now,
        exp: now + (24 * 60 * 60)
    });

    return { token, user, requiresPasswordChange };
}

const changePassword = async (userId, newPassword) => {
    
    if (!newPassword || newPassword.length < 8) {
        throw createError('A senha deve ter no mínimo 8 caracteres.', 400);
    }
    if (!/[A-Z]/.test(newPassword)) {
        throw createError('A senha deve conter ao menos uma letra maiúscula.', 400);
    }
    
    if (!/[^a-zA-Z0-9]/.test(newPassword)) {
        throw createError('A senha deve conter ao menos um caractere especial.', 400);
    }

    
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    
    await usersModel.update(userId, {
        password: passwordHash,
        first_access: new Date()
    });

    return { message: 'Senha alterada com sucesso.' };
};

const forgotPassword = async (identifier) => {
    if (typeof identifier !== 'string' || !identifier.trim()) {
        throw createError('Informe o e-mail ou CPF.', 400);
    }

    const genericMessage =
        'Se o identificador existir no nosso sistema, receberá um e-mail com as instruções de recuperação.';

    try {
        const user = await usersModel.findByIdentifier(identifier.trim());

        if (!user || user.deleted_at !== null) {
            return { message: genericMessage };
        }

        const rawToken = crypto.randomBytes(32).toString('hex');

        const tokenHash = crypto
            .createHash('sha256')
            .update(rawToken)
            .digest('hex');

        const resetUrl = new URL(process.env.FRONTEND_RESET_URL);

        resetUrl.searchParams.set('token', rawToken);

        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        await passwordResetTokensModel.create({
            user_id: user.id,
            token_hash: tokenHash,
            expires_at: expiresAt
        });

        await sendPasswordResetEmail({
            to: user.email,
            name: user.name,
            resetUrl: resetUrl.toString()
        });
    } catch (error) {
        console.error(
            'Falha ao processar recuperação de senha:',
            error.code || 'RESET_EMAIL_FAILED'
        );
    }

    return { message: genericMessage };
};

const resetPassword = async (rawToken, newPassword) => {
    if (!rawToken || !newPassword) {
        throw createError('O token e a nova palavra-passe são obrigatórios.', 400);
    }

    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const tokenRecord = await passwordResetTokensModel.findByToken(tokenHash);

    if (!tokenRecord) {
        throw createError('Token inválido ou expirado.', 400);
    }

    if (tokenRecord.used_at !== null) {
        throw createError('Este token já foi utilizado.', 400);
    }

    if (new Date(tokenRecord.expires_at) < new Date()) {
        throw createError('Este token já expirou.', 400);
    }

    if (newPassword.length < 8) {
        throw createError('A palavra-passe deve ter no mínimo 8 caracteres.', 400);
    }
    if (!/[A-Z]/.test(newPassword)) {
        throw createError('A palavra-passe deve conter ao menos uma letra maiúscula.', 400);
    }
    if (!/[^a-zA-Z0-9]/.test(newPassword)) {
        throw createError('A palavra-passe deve conter ao menos um caractere especial.', 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    const user = await usersModel.findById(tokenRecord.user_id);

if (!user || user.deleted_at !== null) {
    throw createError('Token inválido ou expirado.', 400);
}

await usersModel.update(user.id, {
    password: passwordHash,
    first_access: user.first_access ?? new Date()
});

    await passwordResetTokensModel.markAsUsed(tokenRecord.id);

    return { message: 'Palavra-passe redefinida com sucesso.' };
};

export default {
    login,
    changePassword,
    forgotPassword,
    resetPassword
};