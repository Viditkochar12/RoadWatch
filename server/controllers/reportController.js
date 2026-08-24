const Report = require("../models/Report");
const cloudinary = require("../config/cloudinary");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const { analyzeRoadReport } = require("../services/aiService");

// Delete image from Cloudinary if report creation fails
const deleteUploadedFile = async (file) => {
  if (!file) return;

  try {
    const publicId = file.filename;
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error("Cloudinary cleanup failed:", error.message);
  }
};

// Create Report with Server-Side Validation & AI Problem Modeling
const createReport = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    address,
    latitude,
    longitude,
    severity,
  } = req.body;

  const image = req.file ? req.file.path : "";
  const lat = Number(latitude);
  const lng = Number(longitude);

  // Validation
  if (!title || title.trim().length < 3) {
    await deleteUploadedFile(req.file);
    return next(new AppError("Title must be at least 3 characters", 400));
  }

  if (!description || description.trim().length < 10) {
    await deleteUploadedFile(req.file);
    return next(new AppError("Description must be at least 10 characters", 400));
  }

  if (!address || address.trim().length < 3) {
    await deleteUploadedFile(req.file);
    return next(new AppError("Please provide a valid address", 400));
  }

  if (Number.isNaN(lat) || lat < -90 || lat > 90) {
    await deleteUploadedFile(req.file);
    return next(new AppError("Latitude must be between -90 and 90", 400));
  }

  if (Number.isNaN(lng) || lng < -180 || lng > 180) {
    await deleteUploadedFile(req.file);
    return next(new AppError("Longitude must be between -180 and 180", 400));
  }

  const allowedSeverities = ["Low", "Medium", "High"];
  if (severity && !allowedSeverities.includes(severity)) {
    await deleteUploadedFile(req.file);
    return next(new AppError("Invalid severity level", 400));
  }

  // AI Application Engineering: Auto-Triage & Structured Assessment
  let aiAnalysis = null;
  try {
    aiAnalysis = await analyzeRoadReport({
      title: title.trim(),
      description: description.trim(),
      location: address.trim(),
      reportedSeverity: severity || "Medium",
    });
  } catch (aiErr) {
    console.warn("AI Triage skipped:", aiErr.message);
  }

  // Save report in MongoDB
  const report = await Report.create({
    title: title.trim(),
    description: description.trim(),
    image,
    location: {
      address: address.trim(),
      latitude: lat,
      longitude: lng,
    },
    severity: severity || "Medium",
    reportedBy: req.user._id,
    ...(aiAnalysis && { aiAnalysis }),
  });

  res.status(201).json({
    success: true,
    message: "Report submitted successfully",
    report,
  });
});

// Get All Reports
const getAllReports = asyncHandler(async (req, res) => {
  const reports = await Report.find()
    .populate("reportedBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json(reports);
});

// Get Reports Submitted By Logged-In User
const getMyReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({
    reportedBy: req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json(reports);
});

// Admin: Update Report Status
const updateReportStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const allowedStatuses = [
    "Pending",
    "In Progress",
    "Resolved",
    "Rejected",
  ];

  if (!allowedStatuses.includes(status)) {
    return next(new AppError("Invalid report status", 400));
  }

  const report = await Report.findById(req.params.id);

  if (!report) {
    return next(new AppError("Report not found with given ID", 404));
  }

  report.status = status;
  const updatedReport = await report.save();

  res.status(200).json({
    success: true,
    message: "Report status updated successfully",
    report: updatedReport,
  });
});

module.exports = {
  createReport,
  getAllReports,
  getMyReports,
  updateReportStatus,
};