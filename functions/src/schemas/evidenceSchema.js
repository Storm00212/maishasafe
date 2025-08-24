const {z} = require("zod");

const evidenceSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  type: z.string().min(3, "Evidence type is required"), // e.g. "photo", "video", "document"
});

module.exports = {evidenceSchema};
