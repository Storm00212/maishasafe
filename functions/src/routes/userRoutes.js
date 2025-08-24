const express = require("express");
const {authUser} = require("../controllers/userController.js");

const router = express.Router();

// ✅ Single route for verify + sync
router.post("/auth", authUser);

module.exports = router;
