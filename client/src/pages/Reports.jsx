import { useEffect, useState } from "react";
import { getAllReports } from "../services/reportService";
import ReportMap from "../components/ReportMap";
import Loader from "../components/Loader";
import useDebounce from "../hooks/useDebounce";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";

function Reports() {
  // State management with useState
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  // JavaScript Closures & Hook: useDebounce hook with 300ms delay
  const debouncedSearch = useDebounce(searchInput, 300);

  const [severity, setSeverity] = useState("All");
  const [status, setStatus] = useState("All");

  // Side effects with useEffect: Data fetching with AbortController cleanup
  useEffect(() => {
    const controller = new AbortController();

    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await getAllReports();
        setReports(data);
      } catch (error) {
        if (error.name !== "CanceledError" && error.name !== "AbortError") {
          console.error("Error fetching reports:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReports();

    // Effect cleanup function
    return () => {
      controller.abort();
    };
  }, []);

  // Filtered reports using debounced search value
  const filteredReports = reports.filter((report) => {
    const query = debouncedSearch.toLowerCase().trim();

    const matchesSearch =
      !query ||
      report.title?.toLowerCase().includes(query) ||
      report.description?.toLowerCase().includes(query) ||
      report.location?.address?.toLowerCase().includes(query) ||
      report.aiAnalysis?.category?.toLowerCase().includes(query);

    const matchesSeverity =
      severity === "All" || report.severity === severity;

    const matchesStatus =
      status === "All" || report.status === status;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loader text="Loading reports..." />
      </div>
    );
  }

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
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-amber-300 text-xs font-semibold tracking-widest uppercase shadow-sm mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
            Community Reports & Incident Triage
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-3">
            Road Reports
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto sm:mx-0">
            Real-time feed of civic infrastructure defects reported by citizens,
            augmented with AI problem modeling.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-lg shadow-slate-900/5 border border-slate-100 p-5 sm:p-6 mb-10">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Debounced search (title, address, category)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full border border-slate-200 rounded-full pl-11 pr-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
              />
            </div>

            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="border border-slate-200 rounded-full px-5 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition cursor-pointer font-medium text-slate-700"
            >
              <option value="All">All Severities</option>
              <option value="Low">Low Severity</option>
              <option value="Medium">Medium Severity</option>
              <option value="High">High Severity</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
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
        <p className="text-slate-600 mb-5 px-1 font-medium">
          Showing <span className="font-bold text-slate-900">{filteredReports.length}</span>{" "}
          {filteredReports.length === 1 ? "report" : "reports"}
        </p>

        {/* Map */}
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-900/5 border border-slate-100 overflow-hidden mb-12">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">📍 Live Road Issue Map</h2>
              <p className="text-sm text-slate-500 mt-1">
                Visualizing geospatial distribution of active road issues.
              </p>
            </div>
            <Badge variant="info">Geospatial</Badge>
          </div>
          <div className="p-2 sm:p-3">
            <div className="rounded-2xl overflow-hidden">
              <ReportMap reports={filteredReports} />
            </div>
          </div>
        </div>

        {/* Reports Grid with Compound Card Components */}
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg shadow-slate-900/5 border border-slate-100 p-16 text-center">
            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center text-4xl mx-auto mb-6">
              🔍
            </div>
            <h2 className="text-2xl font-bold text-slate-900">No reports found</h2>
            <p className="text-slate-500 mt-2">Try adjusting your debounced search or filters.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <Card key={report._id} hoverable className="flex flex-col justify-between">
                <div>
                  {report.image && (
                    <Card.Image src={report.image} alt={report.title} />
                  )}

                  <Card.Header>
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <h2 className="text-xl font-bold text-slate-900 leading-snug">
                        {report.title}
                      </h2>
                      <Badge>{report.severity}</Badge>
                    </div>

                    {/* AI Problem Modeling Tag */}
                    {report.aiAnalysis?.category && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-xs bg-slate-900 text-amber-300 font-semibold px-2.5 py-0.5 rounded-md">
                          🤖 AI: {report.aiAnalysis.category.replace(/_/g, " ")}
                        </span>
                        {report.aiAnalysis.safetyHazard && (
                          <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-md">
                            ⚠️ Hazard
                          </span>
                        )}
                      </div>
                    )}
                  </Card.Header>

                  <Card.Body>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {report.description}
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span className="truncate">{report.location?.address || "Location unavailable"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Card.Body>
                </div>

                <Card.Footer>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Status:</span>
                    <Badge variant={report.status}>{report.status || "Pending"}</Badge>
                  </div>
                </Card.Footer>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;