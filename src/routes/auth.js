import { Router } from 'express';

import validateBody from '../middlewares/validateBody.js';
import authSchema from '../validation/authSchema.js';
import loginUserSchema from '../validation/loginUserSchema.js';

import {
  rigesterUserController,
  loginUserController,
  logoutUserController,
  refreshUsersSession,
} from '../controllers/auth.js';

import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = Router();

router.post(
  '/auth/register',
  validateBody(authSchema),
  ctrlWrapper(rigesterUserController),
);

router.post(
  '/auth/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/auth/logout', ctrlWrapper(logoutUserController));

router.post('/auth/refresh', ctrlWrapper(refreshUsersSession));

export default router;
