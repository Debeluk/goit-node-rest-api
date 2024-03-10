import Contact from "../schemas/contactsSchemas.js";

async function listContacts() {
  return Contact.find();
}

async function getContactById(contactId) {
  return Contact.findById(contactId);
}

async function removeContact(contactId) {
  return Contact.findByIdAndDelete(contactId);
}

async function addContact({ name, email, phone, owner }) {
  const newContact = new Contact({
    name,
    email,
    phone,
    owner,
  });
  return newContact.save();
}

async function updateContact(contactId, updateInfo) {
  return Contact.findByIdAndUpdate(contactId, updateInfo, { new: true });
}

async function updateStatusContact(contactId, body) {
  const { favorite } = body;
  if (favorite === undefined) {
    return null;
  }
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    { new: true }
  );
  return updatedContact;
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
