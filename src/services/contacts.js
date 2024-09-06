import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  return await Contacts.find();
};

export const getContactById = async (contactId) => {
  return await Contacts.findById(contactId);
};

export const createContact = async(payload) => {
  const contact = await Contacts.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const contact = await Contacts.findByIdAndUpdate(
    contactId,
    payload,
    {
      new: true,
      ...options,
    },
  );

  return contact;
};

export const deleteContact = async(contactId) => {
  const contact = await Contacts.findByIdAndDelete(contactId);
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


