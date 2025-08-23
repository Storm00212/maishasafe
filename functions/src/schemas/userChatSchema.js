const {z} = require("zod");

/**
 * User Chat Schema
 * Logs chatbot queries & responses per user
 */
const userChatSchema = z.object({
  userId: z.string(), // Firebase Auth UID or temp id
  key: z.string(), // what was asked (e.g. "p3")
  language: z.enum(["en", "sw"]),
  response: z.array(z.string()), // what chatbot returned
  createdAt: z.date().default(() => new Date()),
});

module.exports = {userChatSchema};
