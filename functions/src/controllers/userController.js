/* eslint-disable camelcase */
const {db} = require("../config/firebase.js");
const {Clerk} = require("@clerk/clerk-sdk-node");

const clerk = Clerk({secretKey: process.env.CLERK_SECRET_KEY});

/**
 * Verify Clerk token & sync user to Firestore
 */
const authUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({success: false, error: "Missing token"});
    }

    const token = authHeader.replace("Bearer ", "").trim();

    // ✅ Verify session token with Clerk
    const session = await clerk.sessions.verifySession(token);
    const userId = session.userId;

    // ✅ Get Clerk user info
    const user = await clerk.users.getUser(userId);

    const userData = {
      userId: user.id,
      email: user.email_addresses?.[0]?.email_address || null,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      createdAt: new Date(),
    };

    // ✅ Save/Update in Firestore
    await db.collection("users").doc(user.id).set(userData, {merge: true});

    return res.status(200).json({
      success: true,
      message: "User verified & synced successfully",
      user: userData,
    });
  } catch (err) {
    console.error("❌ Clerk auth error:", err);
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
};

module.exports = {authUser};
