const express = require("express");
const {triggerSOS} = require("../controllers/sosController.js");

const router = express.Router();

router.post("/", triggerSOS);

module.exports = router;
