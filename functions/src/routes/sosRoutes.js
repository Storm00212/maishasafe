const express = require("express");
const {triggerSOS} = require("../controllers/sosController.js");
const {authMiddleware} = require("../middlewares/authMiddleware.js");
const router = express.Router();

router.post("/", authMiddleware, triggerSOS);

module.exports = router;
