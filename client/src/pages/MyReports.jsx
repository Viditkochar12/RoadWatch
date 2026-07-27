import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
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

  const totalReports = reports.length;

  const pendingReports = reports.filter(
    (report) => (report.status || "Pending") === "Pending"
  ).length;

  const inProgressReports = reports.filter(
    (report) => report.status === "In Progress"
  ).length;

  const resolvedReports = reports.filter(
    (report) => report.status === "Resolved"
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-sky-50 to-blue-50 flex items-center justify-center">
        <p className="text-xl text-slate-600">
          Loading your reports...
        </p>
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
            My Reports
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-3">
            Your Reported Issues
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto sm:mx-0">
            Manage all your submitted road damage reports.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

          <StatCard
            value={totalReports}
            title="Total Reports"
            icon="📍"
            accent="border-t-slate-900"
            glow="bg-slate-900/5"
          />

          <StatCard
            value={pendingReports}
            title="Pending"
            icon="⏳"
            accent="border-t-rose-500"
            glow="bg-rose-500/5"
          />

          <StatCard
            value={inProgressReports}
            title="In Progress"
            icon="🚦"
            accent="border-t-blue-500"
            glow="bg-blue-500/5"
          />

          <StatCard
            value={resolvedReports}
            title="Resolved"
            icon="✅"
            accent="border-t-emerald-500"
            glow="bg-emerald-500/5"
          />

        </div>

        {reports.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg shadow-slate-900/5 border border-slate-100 p-16 text-center">
            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center text-4xl mx-auto mb-6">
              📋
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              No reports submitted
            </h2>

            <p className="text-slate-500 mt-2 mb-8">
              Your submitted road reports will appear here.
            </p>

            <Link
              to="/create-report"
              className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-8 py-4 rounded-full shadow-lg shadow-amber-400/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-400/40"
            >
              🚧 Report Your First Issue
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div
                key={report._id}
                className="group bg-white rounded-3xl shadow-md shadow-slate-900/5 border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 duration-300 transition-all"
              >
                {/* Report Image */}
                {report.image && (
                  <div className="overflow-hidden">
                    <img
                      src={report.image}
                      alt={report.title}
                      className="w-full h-52 object-cover transition duration-500 group-hover:scale-110"
                    />
                  </div>
                )}

                {/* Report Content */}
                <div className="p-6">

                  <div className="flex justify-between items-start gap-3 mb-3">
                    <h2 className="text-xl font-bold text-slate-900 leading-snug">
                      {report.title}
                    </h2>

                    <span className="shrink-0 text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                      {report.severity}
                    </span>
                  </div>

                  <p className="text-slate-500 leading-6 mb-5 text-sm">
                    {report.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-1.5">
                    <span>📍</span>
                    <span className="truncate">
                      {report.location?.address || "Location unavailable"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>🕒</span>
                    <span>
                      Reported on{" "}
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
                    </span>
                  </div>

                  <div className="border-t border-slate-100 mt-5 pt-4 flex items-center gap-2">
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

function StatCard({ value, title, icon, accent, glow }) {
  return (
    <div
      className={`relative bg-white/90 backdrop-blur rounded-3xl shadow-md hover:shadow-xl p-8 text-center border-t-4 ${accent} transition-all duration-300 hover:-translate-y-1.5`}
    >
      <div className={`absolute inset-0 rounded-3xl ${glow} pointer-events-none`} />

      <div className="relative text-3xl mb-3" aria-hidden="true">
        {icon}
      </div>

      <h2 className="relative text-4xl font-extrabold text-slate-900">
        {value}
      </h2>

      <p className="relative mt-3 text-slate-500 font-medium">
        {title}
      </p>
    </div>
  );
}

export default MyReports;