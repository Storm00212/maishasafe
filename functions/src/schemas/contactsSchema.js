const {z} = require("zod");

const contactSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  name: z.string().min(1, "Contact name is required"),
  phone: z.string().min(10, "Valid phone number required"),
});

module.exports = {contactSchema};
