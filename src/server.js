import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { env } from './utils/env.js';

import contactsRouter from './routes/contacts.js';
import authRouter from './routes/auth.js';

import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../docs/swagger.json' assert { type: 'json' };

dotenv.config();

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  // Middleware для обробки JSON
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  // Логування
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // Додаємо маршрути для аутентифікації та контактів
  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  // Додаємо Swagger документацію
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Middleware для обробки помилок
  app.use(errorHandler);

  // Middleware для обробки 404 помилок
  app.use(notFoundHandler);

  // Запускаємо сервер на визначеному порту
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
