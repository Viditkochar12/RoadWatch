import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  getAllReports,
  updateReportStatus,
} from "../services/reportService";

import { toast } from "react-toastify";

function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getAllReports();
        setReports(data);
      } catch (error) {
        console.error("Error loading reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      await updateReportStatus(reportId, newStatus, token);

      setReports((currentReports) =>
        currentReports.map((report) =>
          report._id === reportId
            ? { ...report, status: newStatus }
            : report
        )
      );

      toast.success("Status updated successfully!");
    } catch (error) {
      console.error("Status update failed:", error);

      toast.error(
        error.response?.data?.message ||
          "You are not authorized to update this report."
      );
    }
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-xl text-slate-600">
          Loading admin dashboard...
        </p>
      </div>
    );
  }

  // Statistics use ALL reports
  const pending = reports.filter(
    (report) => (report.status || "Pending") === "Pending"
  ).length;

  const inProgress = reports.filter(
    (report) => report.status === "In Progress"
  ).length;

  const resolved = reports.filter(
    (report) => report.status === "Resolved"
  ).length;

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      report.title?.toLowerCase().includes(searchText) ||
      report.description?.toLowerCase().includes(searchText) ||
      report.location?.address?.toLowerCase().includes(searchText) ||
      report.reportedBy?.name?.toLowerCase().includes(searchText) ||
      report.reportedBy?.email?.toLowerCase().includes(searchText);

    const matchesSeverity =
      severityFilter === "All" ||
      report.severity === severityFilter;

    const matchesStatus =
      statusFilter === "All" ||
      (report.status || "Pending") === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="mb-8">
          <p className="font-semibold text-yellow-600 mb-1">
            Administration
          </p>

          <h1 className="text-4xl font-bold text-slate-900">
            Admin Dashboard
          </h1>

          <p className="text-slate-600 mt-2">
            Review road reports and manage their progress.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard
            title="Total Reports"
            value={reports.length}
          />

          <StatCard
            title="Pending"
            value={pending}
          />

          <StatCard
            title="In Progress"
            value={inProgress}
          />

          <StatCard
            title="Resolved"
            value={resolved}
          />
        </div>

        {/* Search + Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
          <div className="grid md:grid-cols-3 gap-4">

            <input
              type="text"
              placeholder="Search title, location, citizen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="border border-slate-300 rounded-xl px-4 py-3 bg-white"
            >
              <option value="All">All Severities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-300 rounded-xl px-4 py-3 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>

          </div>
        </div>

        {/* Result Count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-slate-600">
            Showing{" "}
            <span className="font-bold text-slate-900">
              {filteredReports.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-900">
              {reports.length}
            </span>{" "}
            reports
          </p>

          {(search ||
            severityFilter !== "All" ||
            statusFilter !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSeverityFilter("All");
                setStatusFilter("All");
              }}
              className="text-sm font-semibold text-yellow-600 hover:text-yellow-700 cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Reports */}
        <div className="space-y-5">
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
              <div className="text-4xl mb-3">🔎</div>

              <p className="font-bold text-slate-800 text-lg">
                No reports found
              </p>

              <p className="text-slate-500 mt-1">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">

                  {/* Image */}
                  {report.image && (
                    <div className="overflow-hidden">
                      <img
                        src={report.image}
                        alt={report.title}
                        className="w-full md:w-56 h-52 md:h-auto object-cover transition duration-500 hover:scale-110"
                      />
                    </div>
                  )}

                  {/* Report Content */}
                  <div className="p-6 flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-xl font-bold text-slate-900">
                            {report.title}
                          </h2>

                          <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full">
                            {report.severity}
                          </span>
                        </div>

                        <p className="text-slate-600">
                          {report.description}
                        </p>

                        <p className="text-sm text-slate-500 mt-3">
                          📍{" "}
                          {report.location?.address ||
                            "Location unavailable"}
                        </p>

                        <p className="text-sm text-slate-500 mt-2">
                          🕒 Reported on{" "}
                          {report.createdAt
                            ? new Date(
                                report.createdAt
                              ).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "Date unavailable"}
                        </p>

                        {report.reportedBy && (
                          <p className="text-sm text-slate-500 mt-2">
                            👤{" "}
                            {report.reportedBy.name || "Unknown user"}
                            {report.reportedBy.email
                              ? ` • ${report.reportedBy.email}`
                              : ""}
                          </p>
                        )}
                      </div>

                      {/* Status Control */}
                      <div className="lg:w-56">
                        <label className="block text-sm font-semibold text-slate-600 mb-2">
                          Report Status
                        </label>

                        <select
                          value={report.status || "Pending"}
                          onChange={(e) =>
                            handleStatusChange(
                              report._id,
                              e.target.value
                            )
                          }
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white"
                        >
                          <option value="Pending">
                            Pending
                          </option>

                          <option value="In Progress">
                            In Progress
                          </option>

                          <option value="Resolved">
                            Resolved
                          </option>

                          <option value="Rejected">
                            Rejected
                          </option>
                        </select>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-200">
      <p className="text-slate-500 font-medium">
        {title}
      </p>

      <p className="text-3xl font-bold text-slate-900 mt-2">
        {value}
      </p>
    </div>
  );
}

export default AdminDashboard;