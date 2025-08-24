const express = require("express");
const multer = require("multer");
const {uploadEvidence} = require("../controllers/evidenceController.js");

const router = express.Router();
const upload = multer({storage: multer.memoryStorage()});

router.post("/upload", upload.single("file"), uploadEvidence);

module.exports = router;
