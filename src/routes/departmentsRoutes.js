import { Router } from "express";
import departmentsController from "../controllers/departmentsController.js";

export const departmentsRoutes = Router();

departmentsRoutes.post('/', departmentsController.create);
