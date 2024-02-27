import express from "express";
import validateBody from "../middleware/validateBody.js";
import { updateContactSchema } from "../schemas/contactsSchemas.js";
import { createContactSchema } from "../schemas/contactsSchemas.js";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContactController,
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post('/', validateBody(createContactSchema), createContact);

contactsRouter.put('/:contactId', validateBody(updateContactSchema), updateContactController);

export default contactsRouter;
