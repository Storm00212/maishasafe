const express = require("express");
const {addContact, getContacts, deleteContact} =
require("../controllers/trustedContactsController.js");

const router = express.Router();

router.post("/add", addContact);
router.get("/:userId", getContacts);
router.delete("/:userId/:contactId", deleteContact);

module.exports = router;
