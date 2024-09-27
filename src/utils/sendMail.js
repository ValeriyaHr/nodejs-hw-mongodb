//src/utils/sendMail.js

import nodemailer from 'nodemailer';
import createHttpError from 'http-errors';
import { SMTP } from '../constants/index.js';

console.log('SMTP Configuration:', SMTP);

const transporter = nodemailer.createTransport({
  host: SMTP.HOST,
  port: Number(SMTP.PORT),
  auth: {
    user: SMTP.USER,
    pass: SMTP.PASSWORD,
  },
});

transporter.verify(function (error, success) {
    if (error) {
      console.log('SMTP connection error:', error);
    } else {
      console.log('SMTP server is ready to send emails');
    }
  });

  export const sendMail = async (options) => {
    try {
      const result = await transporter.sendMail(options);
      console.log('Email sent:', result);  // Логування результату
      return result;
    } catch (e) {
      console.error('Error sending email:', e);  // Логування помилки
      throw createHttpError(
        500,
        'Failed to send the email, please try again later.',
      );
    }
  };
