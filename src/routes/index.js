import { Router } from "express";
import { usersRoutes } from "./usersRoutes.js";

export const routes = Router();

routes.use('/users', usersRoutes);