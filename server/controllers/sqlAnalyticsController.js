const asyncHandler = require("../utils/asyncHandler");
const {
  SQL_JOIN_CATALOG,
  SCHEMA_METADATA,
} = require("../database/mockSqlData");

/**
 * Controller to provide Relational Schema & SQL JOINs Explorer Data
 * Route: GET /api/analytics/sql-queries
 */
const getSqlQueriesAndSchema = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      schema: SCHEMA_METADATA,
      joins: SQL_JOIN_CATALOG,
      relationalFeatures: [
        "Primary Keys (PK) & Auto-incrementing SERIAL",
        "Foreign Keys (FK) with ON DELETE CASCADE / ON DELETE SET NULL",
        "Composite Primary Keys on Associative Tables (citizen_votes)",
        "Check Constraints (Regex email validation, coordinate boundaries)",
        "Custom PostgreSQL ENUM data types",
        "B-Tree Indexes for spatial lookups and foreign key joins",
      ],
    },
  });
});

module.exports = {
  getSqlQueriesAndSchema,
};
