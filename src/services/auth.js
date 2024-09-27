//src/services/auth.js

import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/users.js';
import { SessionsCollection } from '../db/models/sessions.js';
import {
  FIFTEEN_MINUTES,
  THIRTY_DAYS,
  SMTP,
  JWT_SECRET,
  APP_DOMAIN,
} from '../constants/index.js';

// Реєстрація нового користувача
export const registerUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UserCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

// Логін користувача
export const loginUser = async ({ email, password }) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Unauthorized');
  }

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  return await SessionsCollection.create({
    ...createSessionData(),
    userId: user._id,
  });
};

// Логаут користувача
export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

// Оновлення сесії
export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Unauthorized');
  }

  if (new Date(session.refreshTokenValidUntil) < new Date()) {
    throw createHttpError(401, 'Session expired');
  }

  const newSessionData = createSessionData();

  await SessionsCollection.deleteOne({
    _id: sessionId,
    refreshToken,
  });

  return await SessionsCollection.create({
    ...newSessionData,
    userId: session.userId,
  });
};

// Функція для генерування сесії
const createSessionData = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

// Функція для створення JWT токена для скиду паролю
const createResetToken = (email) => {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: '5m' });
};

// Відправка листа з токеном для скиду паролю
export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = createResetToken(email);
  const resetPasswordLink = `${APP_DOMAIN}/reset-password?token=${token}`;

  // Налаштування Nodemailer для Brevo
  const transporter = nodemailer.createTransport({
    host: SMTP.HOST,
    port: SMTP.PORT,
    auth: {
      user: SMTP.USER,
      pass: SMTP.PASSWORD,
    },
  });

  const mailOptions = {
    from: SMTP.FROM,
    to: email,
    subject: 'Password Reset',
    html: `<p>To reset your password, click the link below:</p><a href="${resetPasswordLink}">Reset Password</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};

// Оновлення паролю користувача
export const resetPassword = async ({ token, password }) => {
  try {
    const { email } = jwt.verify(token, JWT_SECRET);

    const user = await UserCollection.findOne({ email });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    await UserCollection.updateOne({ email }, { password: encryptedPassword });

    // Видалення сесій для користувача після зміни пароля
    await SessionsCollection.deleteMany({ userId: user._id });
  } catch (error) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }
};
