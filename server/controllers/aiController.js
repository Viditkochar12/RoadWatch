const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const {
  analyzeRoadReport,
  ROAD_REPORT_JSON_SCHEMA,
} = require("../services/aiService");

/**
 * AI Controller for On-Demand Road Issue Analysis & Problem Modeling
 * Route: POST /api/ai/analyze
 */
const analyzeReportIssue = asyncHandler(async (req, res, next) => {
  const { title, description, location, reportedSeverity } = req.body;

  if (!title && !description) {
    return next(
      new AppError(
        "Please provide a title or description for AI problem modeling and analysis.",
        400
      )
    );
  }

  const analysis = await analyzeRoadReport({
    title,
    description,
    location,
    reportedSeverity,
  });

  res.status(200).json({
    success: true,
    data: analysis,
    schema: ROAD_REPORT_JSON_SCHEMA,
    meta: {
      modeledAt: new Date().toISOString(),
      promptTechnique: "Role-Constrained Zero-Shot with Strict JSON Schema",
    },
  });
});

module.exports = {
  analyzeReportIssue,
};
