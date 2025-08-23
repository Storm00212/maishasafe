const admin = require("firebase-admin");
const path = require("path");

let serviceAccount;

// If running locally with emulator, use serviceAccountKey.json
if (process.env.FUNCTIONS_EMULATOR || process.env.FIREBASE_AUTH_EMULATOR_HOST) {
  try {
    serviceAccount = require(path.join(__dirname, "../../maisha-safe-firebase-adminsdk-fbsvc-44e44d8ffc.json"));
  } catch (err) {
    console.warn("⚠️ serviceAccountKey.json not found. Using default credentials.");
  }
}

if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://maisha-safe-default-rtdb.firebaseio.com",
    });
    console.log("✅ Firebase initialized with service account (local)");
  } else {
    admin.initializeApp(); // Works automatically in deployed Firebase Functions
    console.log("✅ Firebase initialized with default credentials (production)");
  }
}

const db = admin.firestore();

module.exports = {db, admin};
