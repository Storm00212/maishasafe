const {db} = require("../config/firebase.js");
const {contactSchema} = require("../schemas/contactSchema.js");

const addContact = async (req, res) => {
  try {
    const parsed = contactSchema.parse(req.body);

    const docRef = db.collection("trustedContacts").doc();
    const contactData = {
      contactId: docRef.id,
      ...parsed,
      createdAt: new Date(),
    };

    await docRef.set(contactData);

    return res.status(201).json({
      success: true,
      message: "Contact added successfully",
      contact: contactData,
    });
  } catch (err) {
    return (
      res.status(400).json({success: false, error: err.errors || err.message})
    );
  }
};

const getContacts = async (req, res) => {
  try {
    const {userId} = req.params;
    const snapshot = await
    db.collection("trustedContacts").where("userId", "==", userId).get();

    const contacts = snapshot.docs.map((doc) => doc.data());

    return res.status(200).json({success: true, contacts});
  } catch (err) {
    return res.status(500).json({success: false, error: err.message});
  }
};

const deleteContact = async (req, res) => {
  try {
    const {userId, contactId} = req.params;

    const docRef = db.collection("trustedContacts").doc(contactId);
    await docRef.delete();
    console.log("Contact deleted:", contactId);
    console.log("For:", userId);
    return (
      res.status(200).
          json({success: true, message: "Contact deleted successfully"})
    );
  } catch (err) {
    return res.status(500).json({success: false, error: err.message});
  }
};

module.exports = {addContact, getContacts, deleteContact};
