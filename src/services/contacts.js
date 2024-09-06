import { ContactsCollection } from '../db/models/contacts.js'; // Переконайтеся, що імпорт коректний

// Отримати всі контакти
export const getAllContacts = async () => {
  return await ContactsCollection.find(); // Використання правильного об'єкта моделі
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
