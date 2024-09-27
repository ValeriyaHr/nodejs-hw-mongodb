//src/routes/contacts.js

import express from 'express';

import {
  getContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  deleteContactController
} from "../controllers/contacts.js";

import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { createContactSchema, updateContactSchema } from "../validation/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import isValidId from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController)); // Отримати всі контакти
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController)); // Отримати контакт за ID
router.post('/', validateBody(createContactSchema), ctrlWrapper(createContactController)); // Створити контакт
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(patchContactController)); // Оновити контакт
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController)); // Видалити контакт

export default router;
