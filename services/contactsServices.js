import Contact from "../schemas/contactsSchemas.js";

async function listContacts(ownerId) {
  return Contact.find({ owner: ownerId }).exec();
}

async function getContactById(contactId, ownerId) {
  return Contact.findOne({ _id: contactId, owner: ownerId });
}

async function removeContact(contactId, ownerId) {
  return Contact.findOneAndDelete({ _id: contactId, owner: ownerId });
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

async function updateContact(contactId, updateInfo, ownerId) {
  return Contact.findOneAndUpdate(
    { _id: contactId, owner: ownerId },
    updateInfo,
    { new: true }
  );
}

async function updateStatusContact(contactId, body, ownerId) {
  const { favorite } = body;
  if (favorite === undefined) {
    return null;
  }
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, owner: ownerId },
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
