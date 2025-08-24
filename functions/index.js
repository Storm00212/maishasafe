/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const Twilio = require("twilio");
const {configDotenv} = require("dotenv");
const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sosRoutes = require("./src/routes/sosRoutes.js");
const chatbotRoutes = require("./src/routes/chatbotRoute.js");
const userRoutes = require("./src/routes/userRoutes.js");
const counselingRoutes = require("./routes/counselingRoutes.js");
const evidenceRoutes = require("./routes/evidenceRoutes.js");
const trustedContactsRoutes = require("./routes/trustedContactsRoutes.js");
const app = express();

app.use(cors({origin: true}));
app.use(express.json());

// API routes
app.use("/sos", sosRoutes);
app.use("/chatbot", chatbotRoutes);
app.use("/users", userRoutes);
app.use("/api/counseling", counselingRoutes);
app.use("/api/evidence", evidenceRoutes);
app.use("/api/contacts", trustedContactsRoutes);

exports.api = functions.https.onRequest(app);


