import { THIRTY_DAYS } from '../constants/index.js';
import { registerUser, loginUser, logoutUser, refreshUserSession } from '../services/auth.js';

// Реєстрація нового користувача
export const registerUserController = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      status: '201',
      message: 'Successfully registered a user!',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Логін користувача
export const loginUserController = async (req, res, next) => {
  try {
    const sessionData = await loginUser(req.body);

    setupSession(res, sessionData);

    res.status(200).json({
      status: '200',
      message: 'Successfully logged in an user!',
      data: {
        accessToken: sessionData.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Логаут користувача
export const logoutUserController = async (req, res, next) => {
  try {
    if (req.cookies.sessionId) {
      await logoutUser(req.cookies.sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Оновлення сесії
export const refreshUsersSession = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;

    if (!sessionId || !refreshToken) {
      throw createHttpError(400, 'Missing sessionId or refreshToken in cookies');
    }

    const session = await refreshUserSession({ sessionId, refreshToken });
    setupSession(res, session);

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Налаштування сесії
const setupSession = async (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: 'Strict',
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: 'Strict',
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
};
