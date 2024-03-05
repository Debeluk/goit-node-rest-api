import express from "express";
import validateBody from "../middleware/validateBody.js";
import Contact from "../schemas/contactsSchemas.js";
import { createContactSchema, updateContactSchema } from "../validation/validationSchemas.js";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContactController,
  updateContactFavorite
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post('/', validateBody(createContactSchema), createContact);

contactsRouter.put('/:id', validateBody(updateContactSchema), updateContactController);

contactsRouter.patch('/:contactId/favorite', updateContactFavorite);

export default contactsRouter;
