import { Router } from "express";
import { usersRoutes } from "./usersRoutes.js";
import { departmentsRoutes } from "./departmentsRoutes.js";

export const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/departments', departmentsRoutes);
