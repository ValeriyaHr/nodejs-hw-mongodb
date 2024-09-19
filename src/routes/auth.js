//src/routers/auth.js:

import { Router } from 'express';

import { validateBody } from '../middlewares/validateBody.js';
import authSchema from '../validation/authSchema.js';
import loginUserSchema from '../validation/loginUserSchema.js';

import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUsersSession,
} from '../controllers/auth.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const authrouter = Router();

authrouter.post(
  '/register',
  validateBody(authSchema),
  ctrlWrapper(registerUserController),
);

authrouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

authrouter.post('/logout', ctrlWrapper(logoutUserController));

authrouter.post('/refresh', ctrlWrapper(refreshUsersSession));

export default authrouter;
