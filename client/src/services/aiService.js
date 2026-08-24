import api from "./api";

/**
 * AI Service for RoadWatch Incident Triage & Structured Outputs
 */
export const analyzeReportWithAI = async ({ title, description, location, reportedSeverity }, token) => {
  const response = await api.post(
    "/ai/analyze",
    {
      title,
      description,
      location,
      reportedSeverity,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
