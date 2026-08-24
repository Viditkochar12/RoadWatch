const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Report title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
    },

    description: {
      type: String,
      required: [true, "Report description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
    },

    image: {
      type: String,
      default: "",
    },

    location: {
      address: {
        type: String,
        required: [true, "Address location is required"],
        trim: true,
      },

      latitude: {
        type: Number,
        required: [true, "Latitude is required"],
        min: [-90, "Latitude must be between -90 and 90"],
        max: [90, "Latitude must be between -90 and 90"],
      },

      longitude: {
        type: Number,
        required: [true, "Longitude is required"],
        min: [-180, "Longitude must be between -180 and 180"],
        max: [180, "Longitude must be between -180 and 180"],
      },
    },

    severity: {
      type: String,
      enum: {
        values: ["Low", "Medium", "High"],
        message: "{VALUE} is not a valid severity level",
      },
      default: "Medium",
    },

    status: {
      type: String,
      enum: {
        values: ["Pending", "In Progress", "Resolved", "Rejected"],
        message: "{VALUE} is not a valid report status",
      },
      default: "Pending",
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Report must belong to a registered user"],
    },

    // AI Application Engineering: Structured Output Assessment
    aiAnalysis: {
      category: { type: String, default: "other" },
      aiSeverity: { type: String, default: "Medium" },
      urgencyScore: { type: Number, default: 5 },
      summary: { type: String, default: "" },
      actionableRecommendation: { type: String, default: "" },
      estimatedRepairDays: { type: Number, default: 3 },
      safetyHazard: { type: Boolean, default: false },
      departmentsToNotify: [{ type: String }],
      analyzedAt: { type: Date, default: Date.now },
      engine: { type: String, default: "heuristic" },
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for high-performance querying and filtering
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ "location.latitude": 1, "location.longitude": 1 });
reportSchema.index({ reportedBy: 1 });

module.exports = mongoose.model("Report", reportSchema);