import { Router } from "express";
import authController from "../controllers/authController.js";
import { ensureAuthenticated } from "../middlewares/authMiddleware.js";

export const authRoutes = Router();

authRoutes.post('/login', authController.login);
authRoutes.post('/logout', ensureAuthenticated, authController.logout);

authRoutes.post('/change-password', ensureAuthenticated, authController.changePassword);
authRoutes.post('/forgot-password', authController.forgotPassword);
authRoutes.post('/reset-password', authController.resetPassword);