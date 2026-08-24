const OpenAI = require("openai");
const config = require("../config/env");

/**
 * AI Application Engineering: Road Hazard Triage & Problem Modeling
 *
 * 1. Prompt Engineering:
 *    - System Prompt establishes role, safety context, precision constraints,
 *      and strict categorization rules.
 * 2. Structured Outputs:
 *    - Uses OpenAI JSON Schema strict response format to guarantee deterministic JSON output.
 * 3. Problem Modeling:
 *    - Models civic infrastructure damage into actionable dimensions:
 *      (category, severity, urgencyScore, estimatedRepairDays, safetyHazard, departments).
 */

const openai = config.openai.apiKey
  ? new OpenAI({ apiKey: config.openai.apiKey })
  : null;

// The JSON Schema definition for Structured Outputs
const ROAD_REPORT_JSON_SCHEMA = {
  name: "road_report_triage_analysis",
  strict: true,
  schema: {
    type: "object",
    properties: {
      category: {
        type: "string",
        enum: [
          "pothole",
          "cracked_pavement",
          "waterlogging",
          "broken_streetlight",
          "missing_manhole_cover",
          "cave_in_sinkhole",
          "road_obstruction",
          "other",
        ],
        description: "Standardized taxonomy category of the civic road issue",
      },
      aiSeverity: {
        type: "string",
        enum: ["Low", "Medium", "High", "Critical"],
        description: "AI-assessed risk severity level based on physical hazard",
      },
      urgencyScore: {
        type: "integer",
        description: "Priority score from 1 (minor cosmetic) to 10 (immediate life threat)",
      },
      summary: {
        type: "string",
        description: "Concise 1-2 sentence executive summary of the problem",
      },
      actionableRecommendation: {
        type: "string",
        description: "Specific repair action recommended for the municipal engineering team",
      },
      estimatedRepairDays: {
        type: "integer",
        description: "Estimated days required for municipal crew resolution",
      },
      safetyHazard: {
        type: "boolean",
        description: "True if issue poses an immediate collision or injury hazard to motorists/pedestrians",
      },
      departmentsToNotify: {
        type: "array",
        items: { type: "string" },
        description: "Municipal departments required for dispatch (e.g. Public Works, Traffic Police, Electrical Dept)",
      },
    },
    required: [
      "category",
      "aiSeverity",
      "urgencyScore",
      "summary",
      "actionableRecommendation",
      "estimatedRepairDays",
      "safetyHazard",
      "departmentsToNotify",
    ],
    additionalProperties: false,
  },
};

/**
 * Heuristic Fallback Engine
 * Problem modeling fallback for offline development, rate limits, or missing API keys.
 */
const fallbackHeuristicAnalysis = ({ title = "", description = "", location = "", reportedSeverity = "Medium" }) => {
  const text = `${title} ${description}`.toLowerCase();

  let category = "other";
  let aiSeverity = reportedSeverity;
  let urgencyScore = 5;
  let estimatedRepairDays = 4;
  let safetyHazard = false;
  const departmentsToNotify = ["Public Works Department"];

  if (text.includes("sinkhole") || text.includes("cave in") || text.includes("collapse")) {
    category = "cave_in_sinkhole";
    aiSeverity = "Critical";
    urgencyScore = 10;
    estimatedRepairDays = 14;
    safetyHazard = true;
    departmentsToNotify.push("Disaster Management", "Traffic Police");
  } else if (text.includes("manhole") || text.includes("open drain")) {
    category = "missing_manhole_cover";
    aiSeverity = "Critical";
    urgencyScore = 9;
    estimatedRepairDays = 2;
    safetyHazard = true;
    departmentsToNotify.push("Sanitation & Drainage", "Traffic Police");
  } else if (text.includes("pothole") || text.includes("crater") || text.includes("bump")) {
    category = "pothole";
    aiSeverity = text.includes("deep") || text.includes("huge") || text.includes("big") ? "High" : "Medium";
    urgencyScore = aiSeverity === "High" ? 7 : 5;
    estimatedRepairDays = 3;
    safetyHazard = aiSeverity === "High";
  } else if (text.includes("water") || text.includes("flood") || text.includes("drainage")) {
    category = "waterlogging";
    aiSeverity = "Medium";
    urgencyScore = 6;
    estimatedRepairDays = 5;
    departmentsToNotify.push("Stormwater Drainage Dept");
  } else if (text.includes("light") || text.includes("dark") || text.includes("pole") || text.includes("electric")) {
    category = "broken_streetlight";
    aiSeverity = "Medium";
    urgencyScore = 4;
    estimatedRepairDays = 2;
    departmentsToNotify.push("Municipal Electrical Division");
  } else if (text.includes("crack") || text.includes("surface") || text.includes("tar")) {
    category = "cracked_pavement";
    aiSeverity = "Low";
    urgencyScore = 3;
    estimatedRepairDays = 7;
  }

  const summary = `Classified as ${category.replace(/_/g, " ")} with ${aiSeverity.toLowerCase()} priority based on incident description.`;
  const actionableRecommendation = `Dispatch ${departmentsToNotify[0]} inspection unit to ${location || "reported site"} to verify issue extent and schedule asphalt/structural patching.`;

  return {
    category,
    aiSeverity,
    urgencyScore,
    summary,
    actionableRecommendation,
    estimatedRepairDays,
    safetyHazard,
    departmentsToNotify,
    engine: "heuristic-fallback-v1",
  };
};

/**
 * Analyze Road Damage Report using OpenAI Structured Outputs
 * with Prompt Engineering & Problem Modeling
 */
const analyzeRoadReport = async ({
  title,
  description,
  location,
  reportedSeverity,
}) => {
  // If no OpenAI API Key configured, use the deterministic heuristic model
  if (!openai || !config.openai.apiKey) {
    return fallbackHeuristicAnalysis({
      title,
      description,
      location,
      reportedSeverity,
    });
  }

  try {
    const systemPrompt = `
You are the AI Road Triage & Infrastructure Safety Assessment Engine for the RoadWatch civic platform.
Your job is to objectively analyze citizen road defect reports and produce structured assessment metrics.

Guidelines for Problem Modeling:
1. Categorize into one of the standardized taxonomy types.
2. Determine realistic severity (Low, Medium, High, Critical) based on direct vehicular and pedestrian safety risks.
   - Low: Minor surface cosmetic cracks, fading lane marks.
   - Medium: Moderate potholes (< 5cm deep), non-functioning streetlights in low-speed zones.
   - High: Deep potholes (> 5cm) on arterial roads, missing drainage grates.
   - Critical: Active sinkholes, bridge joint failures, missing manholes on active roadways.
3. Assign an urgency score (1 to 10).
4. Provide concise executive summaries and actionable municipal recommendations.
5. Flag safetyHazard as true if immediate accident or injury risk exists.
6. Designate specific departments to dispatch.
`.trim();

    const userPrompt = `
Road Defect Report Details:
- Title: ${title || "Not provided"}
- Description: ${description || "Not provided"}
- Reported Location: ${location || "Location not provided"}
- Citizen-Reported Severity: ${reportedSeverity || "Medium"}

Analyze this report and output the structured JSON triage object strictly matching the schema.
`.trim();

    const response = await openai.chat.completions.create({
      model: config.openai.model || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: ROAD_REPORT_JSON_SCHEMA,
      },
      temperature: 0.1, // low temperature for deterministic evaluation
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    return {
      ...parsed,
      engine: "openai-structured-output",
    };
  } catch (error) {
    console.error("OpenAI analysis failed, falling back to heuristic engine:", error.message);
    return fallbackHeuristicAnalysis({
      title,
      description,
      location,
      reportedSeverity,
    });
  }
};

module.exports = {
  analyzeRoadReport,
  fallbackHeuristicAnalysis,
  ROAD_REPORT_JSON_SCHEMA,
};