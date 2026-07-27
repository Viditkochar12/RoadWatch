import { useEffect, useState } from "react";
import { getAllReports } from "../services/reportService";
import ReportMap from "../components/ReportMap";
import Loader from "../components/Loader";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getAllReports();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = reports.filter((report) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      report.title?.toLowerCase().includes(searchText) ||
      report.description?.toLowerCase().includes(searchText) ||
      report.location?.address?.toLowerCase().includes(searchText);

    const matchesSeverity =
      severity === "All" || report.severity === severity;

    const matchesStatus =
      status === "All" || report.status === status;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Loader text="Loading reports..." />
      </div>
    );
  }

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

        {/* Hero Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-amber-300 text-xs font-semibold tracking-widest uppercase shadow-sm mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
            Community Reports
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-3">
            Road Reports
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto sm:mx-0">
            Explore road damage reported by citizens across your city.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-lg shadow-slate-900/5 border border-slate-100 p-5 sm:p-6 mb-10">
          <div className="grid md:grid-cols-3 gap-4">

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search title, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-slate-200 rounded-full pl-11 pr-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
              />
            </div>

            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="border border-slate-200 rounded-full px-5 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition cursor-pointer"
            >
              <option value="All">All Severities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
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
        <p className="text-slate-600 mb-5 px-1">
          Showing{" "}
          <span className="font-bold text-slate-900">
            {filteredReports.length}
          </span>{" "}
          {filteredReports.length === 1 ? "report" : "reports"}
        </p>

        {/* Map Card */}
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-900/5 border border-slate-100 overflow-hidden mb-12">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">
              📍 Live Road Issue Map
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Track all reported infrastructure issues.
            </p>
          </div>
          <div className="p-2 sm:p-3">
            <div className="rounded-2xl overflow-hidden">
              <ReportMap reports={filteredReports} />
            </div>
          </div>
        </div>

        {/* Reports */}
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg shadow-slate-900/5 border border-slate-100 p-16 text-center">
            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center text-4xl mx-auto mb-6">
              🔍
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              No reports found
            </h2>

            <p className="text-slate-500 mt-2">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <div
                key={report._id}
                className="group bg-white rounded-3xl shadow-md shadow-slate-900/5 border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 duration-300 transition-all"
              >

                {/* Image */}
                {report.image && (
                  <div className="overflow-hidden">
                    <img
                      src={report.image}
                      alt={report.title}
                      className="w-full h-52 object-cover transition duration-500 group-hover:scale-110"
                    />
                  </div>
                )}

                <div className="p-6">

                  {/* Title + Severity */}
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <h2 className="text-xl font-bold text-slate-900 leading-snug">
                      {report.title}
                    </h2>

                    <span
                      className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full ${
                        report.severity === "High"
                          ? "bg-red-100 text-red-700"
                          : report.severity === "Medium"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {report.severity}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-slate-500 leading-6 mb-5 text-sm">
                    {report.description}
                  </p>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-1.5">
                    <span>📍</span>
                    <span className="truncate">
                      {report.location?.address || "Location unavailable"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>📅</span>
                    <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Status */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                    <span className="text-sm text-slate-500">
                      Status:
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

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Reports;