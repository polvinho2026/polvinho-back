import { Router } from 'express';
import { usersRoutes } from './usersRoutes.js';
import { departmentsRoutes } from './departmentsRoutes.js';
import { authRoutes } from './authRoutes.js';

import {
    ensureAuthenticated,
    ensurePasswordChanged
} from '../middlewares/authMiddleware.js';

export const routes = Router();

routes.use('/auth', authRoutes);

routes.use(
    '/users',
    ensureAuthenticated,
    ensurePasswordChanged,
    usersRoutes
);

routes.use(
    '/departments',
    ensureAuthenticated,
    ensurePasswordChanged,
    departmentsRoutes
);