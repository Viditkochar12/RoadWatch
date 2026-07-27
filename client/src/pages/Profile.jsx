import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { getProfile } from "../services/authService";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getProfile(token);

        // Works whether API returns user directly
        // or returns { user: {...} }
        setUser(data.user || data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-sky-50 to-blue-50 flex items-center justify-center">
        <p className="text-xl text-slate-600">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-sky-50 to-blue-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">
            Unable to load profile
          </h2>

          <p className="text-slate-500 mt-2">
            Please log in again and try again.
          </p>
        </div>
      </div>
    );
  }

  const initial = user.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  const isAdmin = user.role === "admin";

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

      <div className="relative px-4 py-14 sm:py-20">
        <div className="max-w-2xl mx-auto">

          {/* Hero */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-amber-300 text-xs font-semibold tracking-widest uppercase shadow-sm mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
              Profile
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-3">
              My Account
            </h1>

            <p className="text-lg text-slate-600 max-w-xl mx-auto">
              Manage your RoadWatch profile and account information.
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white/95 backdrop-blur rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-100 overflow-hidden">

            {/* Header */}
            <div className="relative bg-slate-900 px-8 py-12 text-center overflow-hidden">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative inline-block group">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-900 flex items-center justify-center text-4xl font-bold shadow-lg border-4 border-white/80 transition-transform duration-300 group-hover:scale-105">
                  {initial}
                </div>
                <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-slate-900" />
              </div>

              <h1 className="relative text-3xl font-bold text-white mt-5">
                {user.name}
              </h1>

              <p className="relative text-slate-300 mt-1">
                RoadWatch Account
              </p>
            </div>

            {/* Information */}
            <div className="p-8 space-y-6">
              <ProfileItem
                icon="👤"
                label="Full Name"
                value={user.name || "Unavailable"}
              />

              <ProfileItem
                icon="✉️"
                label="Email Address"
                value={user.email || "Unavailable"}
              />

              <div className="border-b border-slate-100 pb-5">
                <p className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-2">
                  <span>🛡️</span> Account Role
                </p>

                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
                    isAdmin
                      ? "bg-amber-100 text-amber-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {isAdmin ? "🛡️ ADMIN" : "👤 USER"}
                </span>
              </div>

              {user.createdAt && (
                <ProfileItem
                  icon="📅"
                  label="Member Since"
                  value={new Date(user.createdAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                  noBorder
                />
              )}
            </div>

            {/* Quick Actions */}
            <div className="px-8 pb-8">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">
                Quick Actions
              </h2>

              <div className="grid sm:grid-cols-3 gap-3">
                <Link
                  to="/create-report"
                  className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold py-3 rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5"
                >
                  🚧 Report Damage
                </Link>

                <Link
                  to="/my-reports"
                  className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5"
                >
                  📋 My Reports
                </Link>

                <Link
                  to="/"
                  className="flex items-center justify-center gap-2 border-2 border-slate-900 text-slate-900 font-bold py-3 rounded-xl transition-all duration-200 hover:bg-slate-900 hover:text-white hover:-translate-y-0.5"
                >
                  🏠 Home
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ icon, label, value, noBorder }) {
  return (
    <div className={noBorder ? "" : "border-b border-slate-100 pb-5"}>
      <p className="text-sm font-semibold text-slate-500 flex items-center gap-2">
        <span>{icon}</span> {label}
      </p>

      <p className="text-lg font-medium text-slate-900 mt-1.5">
        {value}
      </p>
    </div>
  );
}

export default Profile;