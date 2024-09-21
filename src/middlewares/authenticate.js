import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/sessions.js';
import { UserCollection } from '../db/models/users.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    console.log('Authorization header:', authHeader); // Логування заголовка

    if (!authHeader) {
      console.log('No Authorization header');
      return next(createHttpError(401, 'Unauthorized'));
    }

    const [bearer, token] = authHeader.split(' ');
    console.log('Bearer:', bearer, 'Token:', token); // Логування типу та токена

    if (bearer !== 'Bearer' || !token) {
      console.log('Invalid Bearer token format');
      return next(createHttpError(401, 'Auth header should be of type Bearer'));
    }

    const session = await SessionsCollection.findOne({ accessToken: token });
    console.log('Session:', session); // Логування сесії

    if (!session) {
      console.log('Session not found');
      return next(createHttpError(401, 'Session not found'));
    }

    const isAccessTokenExpired = new Date() > new Date(session.accessTokenValidUntil);
    console.log('Token expiration status:', isAccessTokenExpired); // Логування статусу токена

    if (isAccessTokenExpired) {
      console.log('Access token expired');
      return next(createHttpError(401, 'Access token expired'));
    }

    const user = await UserCollection.findById(session.userId);
    console.log('User:', user); // Логування користувача

    if (!user) {
      console.log('User not found');
      return next(createHttpError(401, 'User not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    next(error);
  }
};

export default authenticate;
