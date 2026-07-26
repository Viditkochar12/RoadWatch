import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllReports } from "../services/reportService";

function Home() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getAllReports();
        setReports(data);
      } catch (error) {
        console.error("Error loading home statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

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

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6">
          RoadWatch
        </h1>

        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10">
          Help make roads safer by reporting potholes, damaged roads,
          broken streetlights, and other infrastructure issues in your city.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <Link
            to="/create-report"
            className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold px-8 py-4 rounded-xl shadow-lg transition"
          >
            🚧 Report Damage
          </Link>

          <Link
            to="/reports"
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition"
          >
            📋 View Reports
          </Link>
        </div>
      </section>

      {/* Statistics */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <StatCard
            value={loading ? "..." : totalReports}
            title="Road Issues Reported"
          />

          <StatCard
            value={loading ? "..." : pendingReports}
            title="Pending"
          />

          <StatCard
            value={loading ? "..." : inProgressReports}
            title="In Progress"
          />

          <StatCard
            value={loading ? "..." : resolvedReports}
            title="Issues Resolved"
          />

        </div>
      </section>

    </div>
  );
}

function StatCard({ value, title }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <h2 className="text-4xl font-bold text-slate-900">
        {value}
      </h2>

      <p className="mt-3 text-slate-600">
        {title}
      </p>
    </div>
  );
}

export default Home;