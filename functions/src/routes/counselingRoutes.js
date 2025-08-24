const express = require("express");
const {bookCounseling} = require("../controllers/counselingController.js");

const router = express.Router();

router.post("/book", bookCounseling);

module.exports = router;
