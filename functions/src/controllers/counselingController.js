const {db} = require("../config/firebase.js");
const {sendWhatsAppInfobip} = require("../utils/infobip.js");
const {counselingSchema} = require("../schemas/counselingSchema.js");

const COUNSELING_NUMBER = "+254742180636";

const bookCounseling = async (req, res) => {
  try {
    const parsed = counselingSchema.parse(req.body);

    const docRef = db.collection("counselingSessions").doc();
    const sessionData = {
      sessionId: docRef.id,
      ...parsed,
      status: "pending",
      createdAt: new Date(),
    };

    await docRef.set(sessionData);

    // Notify counselor
    await sendWhatsAppInfobip(COUNSELING_NUMBER, [
      `New counseling request from ${parsed.userId}`,
      `Topic: ${parsed.topic}`,
      `Preferred Time: ${parsed.preferredTime}`,
    ]);

    return res.status(201).json({
      success: true,
      message: "Counseling session booked successfully",
      session: sessionData,
    });
  } catch (err) {
    console.error("❌ Counseling error:", err.errors || err.message || err);
    return res.status(400).json({
      success: false,
      error: err.errors || err.message || "Validation/Processing error",
    });
  }
};

module.exports = {bookCounseling};
