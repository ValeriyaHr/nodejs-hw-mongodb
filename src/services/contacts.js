//src/services/contacts.js

import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from "../constants/index.js";

// Отримати всі контакти авторизованого користувача
export const getAllContacts = async (
  userId, // Додаємо userId для фільтрації контактів
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find({ userId }); // Фільтр для отримання контактів тільки для користувача

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  try {
    const [contactsCount, contacts] = await Promise.all([
      ContactsCollection.countDocuments(contactsQuery.getFilter()), // Підрахунок документів
      contactsQuery
        .limit(limit)
        .skip(skip)
        .sort({ [sortBy]: sortOrder === SORT_ORDER.ASC ? 1 : -1 })
        .exec(),
    ]);

    const paginationData = calculatePaginationData(contactsCount, page, perPage, contacts);

    return {
      ...paginationData,
      data: contacts,
    };
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw new Error('Failed to fetch contacts');
  }
};

// Отримати контакт за ID для авторизованого користувача
export const getContactById = async (userId, contactId) => {
  try {
    return await ContactsCollection.findOne({ _id: contactId, userId }); // Фільтрація по userId
  } catch (error) {
    console.error('Error fetching contact by ID:', error);
    throw new Error('Failed to fetch contact by ID');
  }
};

// Створити новий контакт для авторизованого користувача
export const createContact = async (userId, payload) => {
  try {
    const contact = await ContactsCollection.create({ ...payload, userId }); // Додаємо userId
    return contact;
  } catch (error) {
    console.error('Error creating contact:', error);
    throw new Error('Failed to create contact');
  }
};

// Оновити контакт за ID для авторизованого користувача
export const updateContact = async (userId, contactId, payload, options = {}) => {
  try {
    const contact = await ContactsCollection.findOneAndUpdate(
      { _id: contactId, userId }, // Фільтр по userId
      payload,
      {
        new: true,
        ...options,
      }
    );
    return contact;
  } catch (error) {
    console.error('Error updating contact:', error);
    throw new Error('Failed to update contact');
  }
};

// Видалити контакт за ID для авторизованого користувача
export const deleteContact = async (userId, contactId) => {
  try {
    const contact = await ContactsCollection.findOneAndDelete({ _id: contactId, userId }); // Фільтр по userId
    return contact;
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw new Error('Failed to delete contact');
  }
};
