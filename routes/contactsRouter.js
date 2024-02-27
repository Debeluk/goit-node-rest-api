import express from "express";
import validateBody from "../middleware/validateBody.js";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContactController,
} from "../controllers/contactsControllers.js";
import { updateContact } from "../services/contactsServices.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post('/', validateBody(createContact), createContact);

contactsRouter.put('/:contactId', validateBody(updateContactController), updateContactController);

export default contactsRouter;
