import {
    registerUser,
    loginUser,
    logoutUser,
    refreshUserSession,
  } from '../services/auth.js';

  import { THIRTY_DAYS } from '../constants/index.js';

  export const rigesterUserController = async (req, res) => {
    const user = await registerUser(req.body);

    res.status(201).json({
      status: '201',
      message: 'Successfully registered a user!',
      data: user,
    });
  };

  export const loginUserController = async (req, res) => {
    const sessionData = await loginUser(req.body);

    setupSession(res, sessionData);

    res.status(200).json({
      status: '200',
      message: 'Successfully logged in an user!',
      data: {
        accessToken: sessionData.accessToken,
      },
    });
  };

  export const logoutUserController = async (req, res) => {
    if (req.cookies.sessionId) {
      await logoutUser(req.cookies.sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
  };

  export const refreshUsersSession = async (req, res) => {
    const session = await refreshUserSession(req.cookies);

    setupSession(res, session);

    res.json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: session.accessToken,
      },
    });
  };

  const setupSession = async (res, session) => {
    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + THIRTY_DAYS),
    });

    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: new Date(Date.now() + THIRTY_DAYS),
    });
  };
