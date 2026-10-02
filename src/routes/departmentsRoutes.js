import { Router } from "express";
import departmentsController from "../controllers/departmentsController.js";

export const departmentsRoutes = Router();

departmentsRoutes.post('/', departmentsController.create);
departmentsRoutes.get('/', departmentsController.list);
departmentsRoutes.delete('/:id/users/:userId', departmentsController.removeUser);
