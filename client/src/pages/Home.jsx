import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Loader text="Loading RoadWatch..." />
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
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-300/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 right-0 w-[28rem] h-[28rem] bg-blue-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[40rem] h-40 bg-slate-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-amber-300 text-xs font-semibold tracking-widest uppercase shadow-sm mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
          Civic Infrastructure · Live Reporting
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.05]">
          🚧 Road<span className="text-amber-500">Watch</span>
        </h1>

        {/* lane-marker divider — signature element */}
        <div className="flex justify-center items-center gap-2 mb-8" aria-hidden="true">
          {Array.from({ length: 7 }).map((_, i) => (
            <span
              key={i}
              className="h-1.5 w-8 rounded-full bg-amber-400"
              style={{ opacity: 1 - i * 0.11 }}
            />
          ))}
        </div>

        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
          Building safer roads, one report at a time. Report potholes,
          damaged roads, broken streetlights and other civic issues in
          seconds.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-5">
          <Link
            to="/create-report"
            className="group inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-8 py-4 rounded-full shadow-lg shadow-amber-400/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-400/40 active:translate-y-0"
          >
            🚧 Report Damage
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>

          <Link
            to="/reports"
            className="group inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-slate-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/30 active:translate-y-0"
          >
            📋 View Reports
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>

      {/* Statistics */}
      <section className="relative max-w-7xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <StatCard
            value={totalReports}
            title="Road Issues Reported"
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
            title="Issues Resolved"
            icon="✅"
            accent="border-t-emerald-500"
            glow="bg-emerald-500/5"
          />

        </div>
      </section>

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

export default Home;