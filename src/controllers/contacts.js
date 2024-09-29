//src/controllers/contacts.js

import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

// Отримати всі контакти для авторизованого користувача
export const getContactsController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;  // Витягуємо userId з авторизованого користувача

    const { page = 1, perPage = 10, sortBy = '_id', sortOrder = 'asc' } = req.query;

    const filter = { userId };  // Фільтр за userId

    const { data, totalItems } = await getAllContacts(
      userId,  // Передаємо userId
      parseInt(page),
      parseInt(perPage),
      sortBy,
      sortOrder,
      filter
    );

    const totalPages = Math.ceil(totalItems / perPage);
    const hasPreviousPage = parseInt(page) > 1;
    const hasNextPage = parseInt(page) < totalPages;

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data,
        page: parseInt(page),
        perPage: parseInt(perPage),
        totalItems,
        totalPages,
        hasPreviousPage,
        hasNextPage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Отримати контакт за ID для авторизованого користувача
export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  try {
    const contact = await getContactById(userId, contactId);  // Передаємо userId

    if (!contact) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Створити новий контакт для авторизованого користувача
export const createContactController = async (req, res, next) => {
  const { _id: userId } = req.user;

  try {
    const contact = await createContact(userId, req.body);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Оновити контакт для авторизованого користувача
export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  try {
    const contact = await getContactById(userId, contactId);

    if (!contact) {
      return next(createHttpError(404, 'Contact not found'));
    }

    const updatedContact = await updateContact(userId, contactId, req.body);

    res.json({
      status: 200,
      message: 'Successfully updated contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};


// Видалити контакт для авторизованого користувача
export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  try {
    const contact = await getContactById(userId, contactId);  // Передаємо userId

    if (!contact) {
      return next(createHttpError(404, 'Contact not found'));
    }

    await deleteContact(userId, contactId);  // Передаємо userId

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
