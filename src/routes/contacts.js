// src/routers/contacts.js

import express from 'express';

import { getContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  deleteContactController } from "../controllers/contacts.js";



import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { createContactSchema, updateContactSchema  } from "../validation/contacts.js";
import { validateBody  } from "../middlewares/validateBody.js";

const router = express.Router();
router.get('/contacts', ctrlWrapper(getContactsController));
router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));
router.post('/contacts', ctrlWrapper(createContactController));
router.patch('/contacts/:contactId', ctrlWrapper(patchContactController));
router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));


export default router;

