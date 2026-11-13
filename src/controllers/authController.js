import authService from '../services/authService.js';
import authSessionsModel from '../models/authSessionsModel.js';

const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const data = await authService.login({ identifier, password });
        return res.status(200).json(data);
    } catch (error) {
        
        return res.status(error.statusCode || 400).json({ message: error.message });
    }
};

const logout = async (req, res) => {
    try {
        if (req.loggedUser?.sessionId) {
            await authSessionsModel.revoke(req.loggedUser.sessionId);
        }
        return res.status(200).json({ message: 'Sessão encerrada com sucesso.' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        
        const userId = req.loggedUser.id;
        const { newPassword } = req.body;

        const result = await authService.changePassword(userId, newPassword);
        
        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.statusCode || 400).json({ message: error.message });
    }
};


const forgotPassword = async (req, res) => {
    try {
        const { identifier } = req.body;
        const result = await authService.forgotPassword(identifier);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.statusCode || 400).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const result = await authService.resetPassword(token, newPassword);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.statusCode || 400).json({ message: error.message });
    }
};

export default { login, 
    logout, 
    changePassword,
    forgotPassword,
    resetPassword
};