const {z} = require("zod");

/**
 * SOS Alert Schema
 * Includes location (lat/lng) + address string
 */
const sosAlertSchema = z.object({
  userId: z.string(), // Reference to users.uid
  type: z.enum(["GBV", "Harassment", "Medical", "Other"]), // Emergency type
  message: z.string(), // Short description
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  address: z.string().optional(), // Human-readable address (auto-filled)
  sentTo: z.array(z.string()).nonempty(), // At least 1 contact required
  status: z.enum(["pending", "acknowledged", "resolved"]).default("pending"),
});

module.exports = {sosAlertSchema};
