import { Router } from "express";
import departmentsController from "../controllers/departmentsController.js";

export const departmentsRoutes = Router();

departmentsRoutes.post('/', departmentsController.create);
departmentsRoutes.get('/', departmentsController.list);
departmentsRoutes.get('/:id', departmentsController.show);
departmentsRoutes.delete('/:id/users/:userId', departmentsController.removeUser);
departmentsRoutes.delete('/:id', departmentsController.remove);
departmentsRoutes.get('/', departmentsController.list);
