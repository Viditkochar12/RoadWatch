const express = require("express");
const { getSqlQueriesAndSchema } = require("../controllers/sqlAnalyticsController");

const router = express.Router();

// Public endpoint for inspecting Relational Schema & SQL JOIN Queries
router.get("/sql-queries", getSqlQueriesAndSchema);

module.exports = router;
