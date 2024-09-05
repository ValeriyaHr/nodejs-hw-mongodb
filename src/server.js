import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import { getAllContacts, getContactById, updateContactById } from './services/contacts.js';
import contactsRouter from './routes/contacts.js'; // Імпортуємо роутер



import { env } from './utils/env.js';

const PORT = Number(env('PORT', 3000));


export  function setupServer() {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello World!',
    });
  });



  app.use(contactsRouter);


  // app.get('/contacts', async (req, res) => {
  //   const contacts = await getAllContacts();
  //   res.status(200).json({
  //     status: 200,
  //     message: 'Successfully found contacts!',
  //     data: contacts,
  //   });
  // });

  // app.get('/contacts/:contactId', async (req, res) => {
  //   try {
  //     const { contactId } = req.params;
  //     const contact = await getContactById(contactId);

  //     if (contact) {
  //       res.status(200).json({
  //         status: 200,
  //         message: 'Successfully found contact with id ' + contactId + '!',
  //         data: contact,
  //       });
  //     } else {
  //       res.status(404).json({
  //         message: 'Contact not found',
  //       });
  //     }
  //   } catch (error) {
  //     res.status(500).json({
  //       message: 'Internal server error: ' + error.message,
  //     });
  //   }
  // });


  // app.post('/contacts/:contactId', async (req, res) => {
  //   try {
  //     const { contactId } = req.params;
  //     const contact = await getContactById(contactId);

  //     if (contact) {
  //       res.status(200).json({
  //         status: 200,
  //         message: 'Successfully found contact with id ' + contactId + '!',
  //         data: contact,
  //       });
  //     } else {
  //       res.status(404).json({
  //         message: 'Contact not found',
  //       });
  //     }
  //   } catch (error) {
  //     res.status(500).json({
  //       message: 'Internal server error: ' + error.message,
  //     });
  //   }
  // });

  // app.patch('/contacts/:contactId', async (req, res) => {
  //   try {
  //     const { contactId } = req.params;
  //     const contact = await updateContactById(contactId);

  //     if (contact) {
  //       res.status(200).json({
  //         status: 200,
  //         message: 'Successfully found update contact with id ' + contactId + '!',
  //         data: contact,
  //       });
  //     } else {
  //       res.status(404).json({
  //         message: 'Contact not found',
  //       });
  //     }
  //   } catch (error) {
  //     res.status(500).json({
  //       message: 'Internal server error: ' + error.message,
  //     });
  //   }
  // });
  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found 404',
    });
  });

  // app.use('*', (req, res, next) => {
  //   res.json({ message: 'Not found' });
  // });

  app.use((err, req, res, next) => {
    res.status(500).send({ error: err.message });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

}
