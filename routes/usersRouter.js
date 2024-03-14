import express from "express";
import { register, login, logout, getCurrentUser, verifyUser, resendVerificationEmail } from "../controllers/userControllers.js";
import authenticate from "../middleware/authenticate.js";
import multer from 'multer';
import { updateAvatar, deleteAvatar } from "../controllers/userControllers.js";

const upload = multer({ dest: '../tmp' });
const usersRouter = express.Router();

usersRouter.get('/current', authenticate, getCurrentUser);
usersRouter.post('/register', register);
usersRouter.post('/login', login);
usersRouter.post('/logout', authenticate, logout);
usersRouter.patch('/avatars', authenticate, upload.single('avatar'), updateAvatar);
usersRouter.delete('/avatars', authenticate, deleteAvatar);
usersRouter.get('/verify/:verificationToken', verifyUser);
usersRouter.post('/verify', resendVerificationEmail);

export default usersRouter;
