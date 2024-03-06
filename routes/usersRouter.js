import express from "express";
import { register, login, logout, getCurrentUser } from "../controllers/userControllers.js";
import authenticate from "../middleware/authenticate.js";

const usersRouter = express.Router();

usersRouter.get('/current', authenticate, getCurrentUser);
usersRouter.post('/register', register);
usersRouter.post('/login', login);
usersRouter.post('/logout', authenticate, logout);

export default usersRouter;
