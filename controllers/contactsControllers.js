import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} from "../services/contactsServices.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    if (!ownerId) {
      console.error("No owner");
    }
    const contacts = await listContacts(ownerId);
    res.json(contacts);
  } catch (err) {
    next(err);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    if (!ownerId) {
      console.error("No owner");
    }
    const { id } = req.params;
    const contact = await getContactById(id, ownerId);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(contact);
  } catch (err) {
    next(err);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    if (!ownerId) {
      console.error("No owner");
    }
    const { id } = req.params;
    const contact = await getContactById(id, ownerId);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    if (contact.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await removeContact(id);
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const owner = req.user._id;
    const newContact = await addContact({ name, email, phone, owner });
    console.log(newContact);
    res.status(201).json(newContact);
  } catch (err) {
    next(err);
  }
};

export const updateContactController = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    if (!ownerId) {
      console.error("No owner");
    }
    const { id } = req.params;
    const contact = await getContactById(id, ownerId);

    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }

    if (contact.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updatedContact = await updateContact(id, req.body);
    res.json(updatedContact);
  } catch (err) {
    next(err);
  }
};

export const updateContactFavorite = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    if (!ownerId) {
      console.error("No owner");
    }
    const { id } = req.params;
    const updatedContact = await updateStatusContact(id, req.body, ownerId);
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updatedContact);
  } catch (err) {
    next(err);
  }
};
