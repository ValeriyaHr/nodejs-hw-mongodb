
import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import {SORT_ORDER} from "../constants/index.js";

// Отримати всі контакти
export const getAllContacts = async ({ page = 1, perPage = 10, sortOrder = SORT_ORDER.ASC, sortBy = 'id', filter = {} }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const contactsQuery = ContactsCollection.find();

  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  if (filter.contactType) {

    contactsQuery.where('contactType').equals(filter.contactType);
  }

  const [contactsCount, contacts] = await Promise.all([
    Contacts.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, page, perPage, contacts);

  return {
    ...paginationData,
    data: contacts,
  };
};

// Отримати контакт за ID
export const getContactById = async (contactId) => {
  return await ContactsCollection.findById(contactId); // Використання правильного об'єкта моделі
};

// Створити новий контакт
export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload); // Використання правильного об'єкта моделі
  return contact;
};

// Оновити контакт за ID
export const updateContact = async (contactId, payload, options = {}) => {
  const contact = await ContactsCollection.findByIdAndUpdate(
    contactId,
    payload,
    {
      new: true,
      ...options,
    },
  );

  return contact;
};

// Видалити контакт за ID
export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findByIdAndDelete(contactId); // Використання правильного об'єкта моделі
  return contact;
};
