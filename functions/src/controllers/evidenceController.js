const {db, admin} = require("../config/firebase.js");
const {evidenceSchema} = require("../schemas/evidenceSchema.js");

const bucket = admin.storage().bucket();

const uploadEvidence = async (req, res) => {
  try {
    const parsed = evidenceSchema.parse(req.body);

    if (!req.file) {
      return res.status(400).json({success: false, error: "No file uploaded"});
    }

    const fileName =
    `evidence/${parsed.userId}/${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(fileName);

    await file.save(req.file.buffer, {
      metadata: {contentType: req.file.mimetype},
    });

    const [url] = await file.getSignedUrl({
      action: "read",
      expires: "03-01-2030",
    });

    const docRef = db.collection("evidence").doc();
    const evidenceData = {
      evidenceId: docRef.id,
      userId: parsed.userId,
      type: parsed.type,
      fileName,
      fileUrl: url,
      uploadedAt: new Date(),
    };

    await docRef.set(evidenceData);

    return res.status(201).json({
      success: true,
      message: "Evidence uploaded successfully",
      evidence: evidenceData,
    });
  } catch (err) {
    console.error("❌ Evidence error:", err.errors || err.message || err);
    return res.status(400).json({
      success: false,
      error: err.errors || err.message || "Validation/Processing error",
    });
  }
};

module.exports = {uploadEvidence};
