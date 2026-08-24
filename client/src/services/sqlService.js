import api from "./api";

/**
 * SQL Analytics & Schema Explorer Service
 */
export const getSqlSchemaAndQueries = async () => {
  const response = await api.get("/analytics/sql-queries");
  return response.data;
};
