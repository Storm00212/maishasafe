const {z} = require("zod");

const counselingSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  preferredTime: z.string().min(3, "Preferred time is required"),
});

module.exports = {counselingSchema};
