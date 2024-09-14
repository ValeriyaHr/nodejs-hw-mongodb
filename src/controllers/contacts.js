//src/controllers/contacts.js
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, sortBy = '_id', sortOrder = 'asc' } = req.query; // Отримуємо параметри з req.query
    const filter = {}; // Залишаємо порожній фільтр на випадок додаткової фільтрації

    // Викликаємо функцію getAllContacts з правильними параметрами
    const contacts = await getAllContacts(
      parseInt(page),
      parseInt(perPage),
      sortBy,
      sortOrder,
      filter
    );

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await getContactById(contactId);

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

export const createContactController = async (req, res, next) => {
  const { name, phoneNumber } = req.body;

  if (!name || !phoneNumber) {
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!phoneNumber) missingFields.push('phoneNumber');

    return next(
      createHttpError(400, `Missing required fields: ${missingFields.join(', ')}`)
    );
  }

  try {
    const contact = await createContact(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await updateContact(contactId, req.body);
    if (!result) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.json({
      status: 200,
      message: 'Successfully updated contact!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await deleteContact(contactId);
    if (!contact) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
