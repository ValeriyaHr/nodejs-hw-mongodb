//src/routes/contacts.js

import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

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

// Налаштування Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Налаштування сховища Multer для Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'contacts', // Назва папки в Cloudinary
    allowedFormats: ['jpg', 'png'],
  },
});

// Налаштування multer для використання сховища Cloudinary
const upload = multer({ storage }); // Це дозволить обробляти файли зображень

router.get('/', ctrlWrapper(getContactsController)); // Отримати всі контакти
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController)); // Отримати контакт за ID
router.post('/', upload.single('photo'), validateBody(createContactSchema), ctrlWrapper(createContactController)); // Додано підтримку завантаження фото для створення контакту
router.patch('/:contactId', isValidId, upload.single('photo'), validateBody(updateContactSchema), ctrlWrapper(patchContactController)); // Додано підтримку завантаження фото для оновлення контакту
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController)); // Видалити контакт

export default router;
