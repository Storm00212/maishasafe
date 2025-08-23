const {z} = require("zod");

/**
 * User Schema
 * Stores survivor/guardian/NGO/police details
 */
const userSchema = z.object({
  uid: z.string(), // Firebase Auth UID
  name: z.string().min(1, "Name is required"),
  phone: z.string().regex(/^\+[1-9]\d{6,14}$/, "Phone must be in E.164 format"), // +254712345678
  email: z.string().email().optional(),
  role: z.enum(["survivor", "guardian", "ngo", "police"]),
  trustedContacts: z.array(z.string()).default([]), // contact UIDs or phone numbers
  createdAt: z.date().default(() => new Date()),
});

module.exports = {userSchema};
