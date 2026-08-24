import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAllReports, updateReportStatus } from "../services/reportService";
import { toast } from "react-toastify";
import useDebounce from "../hooks/useDebounce";
import Badge from "../components/common/Badge";
import Card from "../components/common/Card";

function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & State Management with useState
  const [searchInput, setSearchInput] = useState("");
  // JavaScript Closures: debounced search query
  const debouncedSearch = useDebounce(searchInput, 300);

  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Side effects with useEffect: Data fetching with cleanup
  useEffect(() => {
    let isMounted = true;

    const fetchReports = async () => {
      try {
        const data = await getAllReports();
        if (isMounted) setReports(data);
      } catch (error) {
        if (isMounted) console.error("Error loading reports:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReports();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      await updateReportStatus(reportId, newStatus, token);

      // Functional state update
      setReports((currentReports) =>
        currentReports.map((report) =>
          report._id === reportId ? { ...report, status: newStatus } : report
        )
      );

      toast.success(`Status updated to "${newStatus}"!`);
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
        <p className="text-xl text-slate-600 font-semibold">
          Loading admin dashboard...
        </p>
      </div>
    );
  }

  // Statistics
  const pending = reports.filter(
    (r) => (r.status || "Pending") === "Pending"
  ).length;
  const inProgress = reports.filter((r) => r.status === "In Progress").length;
  const resolved = reports.filter((r) => r.status === "Resolved").length;

  // Filtered reports using debounced search
  const filteredReports = reports.filter((report) => {
    const query = debouncedSearch.toLowerCase().trim();

    const matchesSearch =
      !query ||
      report.title?.toLowerCase().includes(query) ||
      report.description?.toLowerCase().includes(query) ||
      report.location?.address?.toLowerCase().includes(query) ||
      report.reportedBy?.name?.toLowerCase().includes(query) ||
      report.reportedBy?.email?.toLowerCase().includes(query) ||
      report.aiAnalysis?.category?.toLowerCase().includes(query);

    const matchesSeverity =
      severityFilter === "All" || report.severity === severityFilter;

    const matchesStatus =
      statusFilter === "All" || (report.status || "Pending") === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-white via-sky-50 to-blue-50 overflow-hidden">
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.06) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14">
        {/* Heading */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-amber-300 text-xs font-semibold tracking-widest uppercase shadow-sm mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
            Admin Operations · AI Incident Triage
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-3">
            Manage Road Reports
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto sm:mx-0">
            Review civic incident complaints, verify AI structured risk assessments,
            and dispatch municipal work orders.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Reports"
            subtitle="All time submissions"
            value={reports.length}
            icon="📄"
            accent="border-t-slate-900"
          />
          <StatCard
            title="Pending"
            subtitle="Awaiting review"
            value={pending}
            icon="🟡"
            accent="border-t-rose-500"
          />
          <StatCard
            title="In Progress"
            subtitle="Being worked on"
            value={inProgress}
            icon="🛠"
            accent="border-t-blue-500"
          />
          <StatCard
            title="Resolved"
            subtitle="Issues fixed"
            value={resolved}
            icon="✅"
            accent="border-t-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-lg shadow-slate-900/5 border border-slate-100 p-5 sm:p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Debounced search (title, address, citizen, AI category)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full border border-slate-200 rounded-full pl-11 pr-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
              />
            </div>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="border border-slate-200 rounded-full px-5 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition cursor-pointer font-medium text-slate-700"
            >
              <option value="All">All Severities</option>
              <option value="Low">Low Severity</option>
              <option value="Medium">Medium Severity</option>
              <option value="High">High Severity</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 rounded-full px-5 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition cursor-pointer font-medium text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Count */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 px-1">
          <p className="text-slate-600 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredReports.length}</span> of{" "}
            <span className="font-bold text-slate-900">{reports.length}</span> reports
          </p>

          {(searchInput || severityFilter !== "All" || statusFilter !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setSeverityFilter("All");
                setStatusFilter("All");
              }}
              className="text-sm font-semibold text-amber-600 hover:text-amber-700 cursor-pointer transition"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Reports List */}
        <div className="space-y-6">
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-lg shadow-slate-900/5 border border-slate-100 p-16 text-center">
              <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center text-4xl mx-auto mb-6">
                🔎
              </div>
              <p className="font-bold text-slate-900 text-2xl">No reports found</p>
              <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <Card key={report._id} hoverable className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {report.image && (
                    <div className="overflow-hidden md:w-72 shrink-0">
                      <img
                        src={report.image}
                        alt={report.title}
                        className="w-full h-52 md:h-full object-cover transition duration-500 hover:scale-105"
                      />
                    </div>
                  )}

                  <div className="p-6 sm:p-7 flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-2.5 mb-2.5">
                          <h2 className="text-xl font-bold text-slate-900">
                            {report.title}
                          </h2>
                          <Badge>{report.severity}</Badge>
                          <Badge variant={report.status}>{report.status || "Pending"}</Badge>

                          {/* AI Problem Modeling Badges */}
                          {report.aiAnalysis?.category && (
                            <span className="text-xs bg-slate-900 text-amber-300 font-bold px-3 py-1 rounded-full">
                              🤖 AI: {report.aiAnalysis.category.replace(/_/g, " ")} (Urgency: {report.aiAnalysis.urgencyScore}/10)
                            </span>
                          )}
                          {report.aiAnalysis?.safetyHazard && (
                            <span className="text-xs bg-red-600 text-white font-bold px-2.5 py-1 rounded-full animate-pulse">
                              ⚠️ High Hazard
                            </span>
                          )}
                        </div>

                        <p className="text-slate-600 text-sm leading-relaxed mb-3">
                          {report.description}
                        </p>

                        {/* AI Recommendation Box for Municipal Admins */}
                        {report.aiAnalysis?.actionableRecommendation && (
                          <div className="mb-4 p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-slate-800">
                            <span className="font-bold text-amber-900 block mb-0.5">
                              Municipal Action Recommendation:
                            </span>
                            {report.aiAnalysis.actionableRecommendation}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
                          <span>📍 {report.location?.address || "Location unavailable"}</span>
                          <span>
                            🕒 Reported on{" "}
                            {report.createdAt
                              ? new Date(report.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "N/A"}
                          </span>
                          {report.reportedBy && (
                            <span>
                              👤 {report.reportedBy.name || "Citizen"} (
                              {report.reportedBy.email || ""})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status Selector */}
                      <div className="lg:w-56 shrink-0 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Update Status
                        </label>
                        <select
                          value={report.status || "Pending"}
                          onChange={(e) =>
                            handleStatusChange(report._id, e.target.value)
                          }
                          className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-semibold text-slate-800 cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, subtitle, value, icon, accent }) {
  return (
    <div
      className={`relative bg-white/90 backdrop-blur rounded-3xl shadow-md hover:shadow-xl p-7 border-t-4 ${accent} transition-all duration-300 hover:-translate-y-1`}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-slate-500 font-semibold text-sm">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-4xl font-black text-slate-900">{value}</p>
      <p className="mt-2 text-xs text-slate-400 font-medium">{subtitle}</p>
    </div>
  );
}

export default AdminDashboard;