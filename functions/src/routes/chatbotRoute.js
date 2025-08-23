const express = require("express");
const {chatbotController}= require("../controllers/chatbotController.js");
const {getChatHistory}= require("../controllers/chatbotController.js");
const router = express.Router();
//sending queries to the chatbot
router.post("/", chatbotController);
//retrieving chat history
router.get("/history/:userId", getChatHistory);
module.exports = router;
