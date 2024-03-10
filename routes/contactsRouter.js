import express from "express";
import validateBody from "../middleware/validateBody.js";
import authenticate from "../middleware/authenticate.js";
import { createContactSchema, updateContactSchema, updateFavoriteSchema } from "../schemas/validateSchemas.js";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContactController,
  updateContactFavorite
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, getAllContacts);
contactsRouter.get("/:id", authenticate, getOneContact);
contactsRouter.delete("/:id", authenticate, deleteContact);
contactsRouter.post('/', authenticate, validateBody(createContactSchema), createContact);
contactsRouter.put('/:id', authenticate, validateBody(updateContactSchema), updateContactController);
contactsRouter.patch('/:id/favorite', authenticate, validateBody(updateFavoriteSchema), updateContactFavorite);

export default contactsRouter;
