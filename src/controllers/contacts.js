// src/controllers/contacts.js

import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res) => {
  const conatacts = await getAllContacts();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: conatacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await getContactById(contactId);

    if (!contact) {
        return next(createHttpError(404, {
          status: 404,
          message: 'Not Found',
          data: { message: 'Contact not found' },
        }));
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

    return next(createHttpError(400, `Missing required fields: ${missingFields.join(', ')}`));
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

export const patchContactController = async(req, res, next) => {
    const {contactId} = req.params;
    const result = await updateContact(contactId, req.body);
    if(!result) {
        next(createHttpError(404,'Contact not found'));
        return;
    }

    res.json({
        status: 200,
        message: 'Successfully updated contact!',
        data: result,
    });
};

export const deleteContactController = async (req, res, next) => {
    const {contactId} = req.params;
    const contact = await deleteContact(contactId);
    if(!contact) {
        next(createHttpError(404,'Contact not found'));
        return;
    }
  res.status(204).send();
};
