const {db} = require("../config/firebase.js");
const {sosAlertSchema} = require("../schemas/sosAlertSchema.js");
const {sendWhatsAppInfobip} = require("../utils/infobip.js");
const nominatim = require("nominatim-client");

const client = nominatim.createClient({
  useragent: "MaishaSafe/1.0", // required
  referer: "http://127.0.0.1:5001/maisha-safe/us-central1/api", // your project or localhost
});

/**
 * Trigger an SOS alert
 */
const triggerSOS = async (req, res) => {
  try {
    //  Validate request body
    const parsed = sosAlertSchema.parse(req.body);

    // Reverse geocode location
    let address = "Unknown location";
    try {
      const geoData = await client.reverse({
        lat: parsed.location.latitude,
        lon: parsed.location.longitude,
        zoom: 18,
        addressdetails: 1,
      });
      address = geoData.display_name || address;
    } catch (geoErr) {
      console.error("⚠️ Nominatim error:", geoErr.message);
    }

    // Save to Firestore
    const docRef = db.collection("sosAlerts").doc();
    const alertData = {
      alertId: docRef.id,
      ...parsed,
      address,
      createdAt: new Date(),
    };
    await docRef.set(alertData);

    // Send WhatsApp messages via Infobip
    for (const contact of parsed.sentTo) {
      await sendWhatsAppInfobip(contact, [
        parsed.message,
        `${parsed.location.latitude}, ${parsed.location.longitude}`,
        address,
      ]);
    }

    return res.status(201).json({
      success: true,
      message: "SOS alert triggered successfully",
      alert: alertData,
    });
  } catch (err) {
    console.error("❌ SOS error:", err.errors || err.message || err);
    return res.status(400).json({
      success: false,
      error: err.errors || err.message || "Validation/Processing error",
    });
  }
};

module.exports = {triggerSOS};
