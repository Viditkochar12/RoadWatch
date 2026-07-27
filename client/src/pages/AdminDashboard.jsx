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
      <div className="min-h-screen bg-gradient-to-b from-white via-sky-50 to-blue-50 flex items-center justify-center">
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
    <div className="min-h-screen relative bg-gradient-to-b from-white via-sky-50 to-blue-50 overflow-hidden">

      {/* Faint blueprint grid backdrop */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.06) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Decorative blurred accents */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 right-0 w-[28rem] h-[28rem] bg-blue-300/25 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14">

        {/* Heading */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-amber-300 text-xs font-semibold tracking-widest uppercase shadow-sm mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
            Admin Dashboard
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-3">
            Manage Road Reports
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto sm:mx-0">
            Monitor and manage all submitted road damage reports from one place.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Reports"
            subtitle="All time submissions"
            value={reports.length}
            icon="📄"
            accent="border-t-slate-900"
            glow="bg-slate-900/5"
          />

          <StatCard
            title="Pending"
            subtitle="Awaiting review"
            value={pending}
            icon="🟡"
            accent="border-t-rose-500"
            glow="bg-rose-500/5"
          />

          <StatCard
            title="In Progress"
            subtitle="Being worked on"
            value={inProgress}
            icon="🛠"
            accent="border-t-blue-500"
            glow="bg-blue-500/5"
          />

          <StatCard
            title="Resolved"
            subtitle="Issues fixed"
            value={resolved}
            icon="✅"
            accent="border-t-emerald-500"
            glow="bg-emerald-500/5"
          />
        </div>

        {/* Search + Filters */}
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-lg shadow-slate-900/5 border border-slate-100 p-5 sm:p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search title, location, citizen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-slate-200 rounded-full pl-11 pr-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
              />
            </div>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="border border-slate-200 rounded-full px-5 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition cursor-pointer"
            >
              <option value="All">All Severities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 rounded-full px-5 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition cursor-pointer"
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
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 px-1">
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
              className="text-sm font-semibold text-amber-600 hover:text-amber-700 cursor-pointer transition"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Reports */}
        <div className="space-y-6">
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-lg shadow-slate-900/5 border border-slate-100 p-16 text-center">
              <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center text-4xl mx-auto mb-6">
                🔎
              </div>

              <p className="font-bold text-slate-900 text-2xl">
                No reports available
              </p>

              <p className="text-slate-500 mt-2">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report._id}
                className="group bg-white rounded-3xl shadow-md shadow-slate-900/5 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">

                  {/* Image */}
                  {report.image && (
                    <div className="overflow-hidden md:w-64 shrink-0">
                      <img
                        src={report.image}
                        alt={report.title}
                        className="w-full h-52 md:h-full object-cover transition duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}

                  {/* Report Content */}
                  <div className="p-6 sm:p-7 flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-3 mb-2">
                          <h2 className="text-xl font-bold text-slate-900">
                            {report.title}
                          </h2>

                          <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                            {report.severity}
                          </span>

                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full ${
                              report.status === "Resolved"
                                ? "bg-green-100 text-green-700"
                                : report.status === "In Progress"
                                ? "bg-blue-100 text-blue-700"
                                : report.status === "Rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {report.status || "Pending"}
                          </span>
                        </div>

                        <p className="text-slate-500 text-sm leading-6">
                          {report.description}
                        </p>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1.5">
                            📍{" "}
                            {report.location?.address ||
                              "Location unavailable"}
                          </span>

                          <span className="flex items-center gap-1.5">
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
                          </span>

                          {report.reportedBy && (
                            <span className="flex items-center gap-1.5">
                              👤{" "}
                              {report.reportedBy.name || "Unknown user"}
                              {report.reportedBy.email
                                ? ` • ${report.reportedBy.email}`
                                : ""}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status Control */}
                      <div className="lg:w-56 shrink-0">
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
                          className="w-full border border-slate-200 rounded-full px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition cursor-pointer font-medium"
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

function StatCard({ title, subtitle, value, icon, accent, glow }) {
  return (
    <div
      className={`relative bg-white/90 backdrop-blur rounded-3xl shadow-md hover:shadow-xl p-7 border-t-4 ${accent} transition-all duration-300 hover:-translate-y-1.5`}
    >
      <div className={`absolute inset-0 rounded-3xl ${glow} pointer-events-none`} />

      <div className="relative flex items-start justify-between mb-4">
        <p className="text-slate-500 font-medium">
          {title}
        </p>
        <span className="text-2xl" aria-hidden="true">
          {icon}
        </span>
      </div>

      <p className="relative text-4xl font-extrabold text-slate-900">
        {value}
      </p>

      <p className="relative mt-2 text-sm text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}

export default AdminDashboard;