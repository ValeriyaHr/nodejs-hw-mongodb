import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();

  return contacts;
};

export const getContactById = async (id) => {
  const contact = await ContactsCollection.findById(id);

  return contact;
};

export const updateContactById = async (id) => {
  const contact = await ContactsCollection.findById(id);

  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};


export const updateContact = async(contactId, data, options = {})=> {
    const rawResult = await ContactsCollection.findOneAndUpdate({ _id: contactId }, data, {
        new: true,
        includeResultMetadata: true,
        ...options,
    });

    if(!rawResult || !rawResult.value) return null;

    return {
        data: rawResult.value,
        isNew: Boolean(rawResult?.lastErrorObject?.upserted),
    };
};

export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
  });

  return contact;
};


