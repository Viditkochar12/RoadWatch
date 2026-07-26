const express = require("express");

const {
  createReport,
  getAllReports,
  getMyReports,
  updateReportStatus,
} = require("../controllers/reportController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/my-reports", protect, getMyReports);
router.post("/", protect, upload.single("image"), createReport);


router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateReportStatus
);

router.get("/", getAllReports);

module.exports = router;