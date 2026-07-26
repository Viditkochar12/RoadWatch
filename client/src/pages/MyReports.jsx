import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getMyReports } from "../services/reportService";

function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchMyReports = async () => {
      try {
        const data = await getMyReports(token);
        setReports(data);
      } catch (error) {
        console.error("Error fetching my reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyReports();
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-xl text-slate-600">
          Loading your reports...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            My Reports
          </h1>

          <p className="text-slate-600 mt-2">
            Track the road issues you have reported.
          </p>
        </div>

        {reports.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="text-5xl mb-4">📋</div>

            <h2 className="text-xl font-bold text-slate-800">
              No reports yet
            </h2>

            <p className="text-slate-500 mt-2">
              Your submitted road reports will appear here.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div
                key={report._id}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
              >
                {/* Report Image */}
                {report.image && (
                  <img
                    src={report.image}
                    alt={report.title}
                    className="w-full h-48 object-cover"
                  />
                )}

                {/* Report Content */}
                <div className="p-6">

                  <div className="flex justify-between gap-3 mb-3">
                    <h2 className="text-xl font-bold text-slate-900">
                      {report.title}
                    </h2>

                    <span className="text-sm font-semibold text-yellow-600">
                      {report.severity}
                    </span>
                  </div>

                  <p className="text-slate-600 mb-4">
                    {report.description}
                  </p>

                  <p className="text-sm text-slate-500">
                    📍{" "}
                    {report.location?.address ||
                      "Location unavailable"}
                  </p>

                  <p className="text-sm text-slate-500 mt-2">
                    🕒 Reported on{" "}
                    {report.createdAt
                      ? new Date(report.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "Date unavailable"}
                  </p>

                  <div className="border-t border-slate-200 mt-5 pt-4">
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

export default MyReports;