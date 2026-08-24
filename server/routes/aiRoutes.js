const express = require("express");
const { analyzeReportIssue } = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Allow authenticated users to perform on-demand AI triage & structured problem modeling
router.post("/analyze", protect, analyzeReportIssue);

module.exports = router;
