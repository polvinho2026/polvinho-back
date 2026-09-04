import { Router } from "express";
import usersController from "../controllers/usersController.js";

export const usersRoutes = Router();

usersRoutes.post('/', usersController.create);
usersRoutes.get('/', usersController.list);
usersRoutes.get('/:id', usersController.show);
usersRoutes.put('/:id', usersController.update);

export default usersRoutes;
