import { useEffect, useState } from "react";
import { getAllReports } from "../services/reportService";
import ReportMap from "../components/ReportMap";

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
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-xl font-semibold text-slate-600">
          Loading reports...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Road Reports
          </h1>

          <p className="text-slate-600 mt-2">
            Explore road damage reported by citizens.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-8">
          <div className="grid md:grid-cols-3 gap-4">

            <input
              type="text"
              placeholder="Search title, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="border border-slate-300 rounded-xl px-4 py-3 bg-white"
            >
              <option value="All">All Severities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
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
        <p className="text-slate-600 mb-5">
          Showing{" "}
          <span className="font-bold text-slate-900">
            {filteredReports.length}
          </span>{" "}
          {filteredReports.length === 1 ? "report" : "reports"}
        </p>
        <div className="mb-10">
          <ReportMap reports={filteredReports} />
        </div>
        {/* Reports */}
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="text-5xl mb-4">🔎</div>

            <h2 className="text-xl font-bold text-slate-800">
              No reports found
            </h2>

            <p className="text-slate-500 mt-2">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <div
                key={report._id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
              >

                {/* Image */}
                {report.image && (
                  <img
                    src={report.image}
                    alt={report.title}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-6">

                  {/* Title + Severity */}
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <h2 className="text-xl font-bold text-slate-900">
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
                  <p className="text-slate-600 mb-5">
                    {report.description}
                  </p>

                  {/* Location */}
                  <p className="text-sm text-slate-500">
                    📍{" "}
                    {report.location?.address ||
                      "Location unavailable"}
                  </p>

                  {/* Status */}
                  <div className="mt-5 pt-4 border-t border-slate-200">
                    <span className="text-sm text-slate-500">
                      Status:{" "}
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