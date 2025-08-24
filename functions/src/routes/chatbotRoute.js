const express = require("express");
const {chatbotController}= require("../controllers/chatbotController.js");
const {getChatHistory}= require("../controllers/chatbotController.js");
const {authMiddleware} = require("../middlewares/authMiddleware.js");
const router = express.Router();
// sending queries to the chatbot
router.post("/", authMiddleware, chatbotController);
// retrieving chat history
router.get("/history/:userId", authMiddleware, getChatHistory);
module.exports = router;
