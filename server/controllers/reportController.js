const Report = require("../models/Report");
const cloudinary = require("../config/cloudinary");

// Delete image from Cloudinary if report creation fails
const deleteUploadedFile = async (file) => {
  if (!file) return;

  try {
    // multer-storage-cloudinary stores the public ID here
    const publicId = file.filename;

    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error("Cloudinary cleanup failed:", error.message);
  }
};

// Create Report
const createReport = async (req, res) => {
  try {
    const {
      title,
      description,
      address,
      latitude,
      longitude,
      severity,
    } = req.body;

    // Cloudinary URL
    const image = req.file ? req.file.path : "";

    const lat = Number(latitude);
    const lng = Number(longitude);

    // Title validation
    if (!title || title.trim().length < 3) {
      await deleteUploadedFile(req.file);

      return res.status(400).json({
        message: "Title must be at least 3 characters",
      });
    }

    // Description validation
    if (!description || description.trim().length < 10) {
      await deleteUploadedFile(req.file);

      return res.status(400).json({
        message: "Description must be at least 10 characters",
      });
    }

    // Address validation
    if (!address || address.trim().length < 3) {
      await deleteUploadedFile(req.file);

      return res.status(400).json({
        message: "Please provide a valid address",
      });
    }

    // Latitude validation
    if (
      Number.isNaN(lat) ||
      lat < -90 ||
      lat > 90
    ) {
      await deleteUploadedFile(req.file);

      return res.status(400).json({
        message: "Latitude must be between -90 and 90",
      });
    }

    // Longitude validation
    if (
      Number.isNaN(lng) ||
      lng < -180 ||
      lng > 180
    ) {
      await deleteUploadedFile(req.file);

      return res.status(400).json({
        message: "Longitude must be between -180 and 180",
      });
    }

    // Severity validation
    const allowedSeverities = [
      "Low",
      "Medium",
      "High",
    ];

    if (!allowedSeverities.includes(severity)) {
      await deleteUploadedFile(req.file);

      return res.status(400).json({
        message: "Invalid severity",
      });
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
      severity,
      reportedBy: req.user._id,
    });

    res.status(201).json({
      message: "Report submitted successfully",
      report,
    });
  } catch (error) {
    // If MongoDB/report creation fails after upload,
    // remove the image from Cloudinary
    await deleteUploadedFile(req.file);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Reports
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Reports Submitted By Logged-In User
const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({
      reportedBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin: Update Report Status
const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "In Progress",
      "Resolved",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid report status",
      });
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    report.status = status;

    const updatedReport = await report.save();

    res.status(200).json({
      message: "Report status updated successfully",
      report: updatedReport,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createReport,
  getAllReports,
  getMyReports,
  updateReportStatus,
};