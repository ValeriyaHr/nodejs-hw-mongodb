// src/routes/auth.js

import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import authSchema from '../validation/authSchema.js';
import loginUserSchema from '../validation/loginUserSchema.js';
import sendResetEmailSchema from '../validation/sendResetEmailSchema.js';
import resetPasswordSchema from '../validation/resetPasswordSchema.js';

import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUsersSession,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(authSchema),
  ctrlWrapper(registerUserController),
);

authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

authRouter.post('/logout', ctrlWrapper(logoutUserController));

authRouter.post('/refresh', ctrlWrapper(refreshUsersSession));

authRouter.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default authRouter;
