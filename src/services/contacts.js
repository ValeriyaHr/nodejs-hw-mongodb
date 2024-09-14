import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from "../constants/index.js";

// Отримати всі контакти
export const getAllContacts = async (
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
) => {

  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find();

  if (filter && filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  if (filter && filter.isFavourite !== undefined) {
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

// Отримати контакт за ID
export const getContactById = async (contactId) => {
  try {
    return await ContactsCollection.findById(contactId);
  } catch (error) {
    console.error('Error fetching contact by ID:', error);
    throw new Error('Failed to fetch contact by ID');
  }
};

// Створити новий контакт
export const createContact = async (payload) => {
  try {
    const contact = await ContactsCollection.create(payload);
    return contact;
  } catch (error) {
    console.error('Error creating contact:', error);
    throw new Error('Failed to create contact');
  }
};

// Оновити контакт за ID
export const updateContact = async (contactId, payload, options = {}) => {
  try {
    const contact = await ContactsCollection.findByIdAndUpdate(contactId, payload, {
      new: true,
      ...options,
    });
    return contact;
  } catch (error) {
    console.error('Error updating contact:', error);
    throw new Error('Failed to update contact');
  }
};

// Видалити контакт за ID
export const deleteContact = async (contactId) => {
  try {
    const contact = await ContactsCollection.findByIdAndDelete(contactId);
    return contact;
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw new Error('Failed to delete contact');
  }
};
