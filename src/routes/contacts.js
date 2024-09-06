// src/routers/contacts.js

import express from 'express';
const router = express.Router();

import { getContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  deleteContactController } from "../controllers/contacts.js";

import { ctrlWrapper } from "../utils/ctrlWrapper.js";


router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

router.post('/contacts', ctrlWrapper(createContactController));

router.patch('/contacts/:contactId', ctrlWrapper(patchContactController));

router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));


export default router;
