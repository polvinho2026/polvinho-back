import { verifyToken } from '../utils/jwt.js';
import authSessionsModel from '../models/authSessionsModel.js';
import usersModel from '../models/usersModel.js';

export async function ensureAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization;
    const match = authHeader?.match(/^Bearer\s+(\S+)$/i);

    if (!match) {
        return res.status(401).json({
            message: 'Não autorizado. Token não fornecido.'
        });
    }

    let payload;

    try {
        payload = verifyToken(match[1]);
    } catch {
        return res.status(401).json({
            message: 'Não autorizado. Token inválido ou expirado.'
        });
    }

    if (
        !payload ||
        typeof payload.sub !== 'string' ||
        typeof payload.jti !== 'string'
    ) {
        return res.status(401).json({
            message: 'Não autorizado. Token inválido ou expirado.'
        });
    }

    try {
        const session = await authSessionsModel.findById(payload.jti);

        const expiresAt = session
            ? new Date(session.expires_at).getTime()
            : NaN;

        if (
            !session ||
            session.user_id !== payload.sub ||
            session.revoked_at !== null ||
            !Number.isFinite(expiresAt) ||
            expiresAt <= Date.now()
        ) {
            return res.status(401).json({
                message: 'Sessão inválida ou expirada.'
            });
        }

        const user = await usersModel.findById(payload.sub);

        if (!user || user.deleted_at !== null) {
            return res.status(401).json({
                message: 'Usuário indisponível para autenticação.'
            });
        }

        req.loggedUser = {
            id: user.id,
            role: user.role,
            sessionId: session.id,
            requiresPasswordChange: user.first_access === null
        };

        return next();
    } catch (error) {
        return next(error);
    }
}

export function ensurePasswordChanged(req, res, next) {
    if (!req.loggedUser) {
        return res.status(401).json({
            message: 'Não autenticado.'
        });
    }

    if (req.loggedUser.requiresPasswordChange) {
        return res.status(403).json({
            code: 'PASSWORD_CHANGE_REQUIRED',
            message: 'Redefina sua senha para continuar.'
        });
    }

    return next();
}