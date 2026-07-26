import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
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
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-xl text-slate-600">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
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

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="max-w-2xl mx-auto">

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* Header */}
          <div className="bg-slate-900 px-8 py-10 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-yellow-400 text-slate-900 flex items-center justify-center text-3xl font-bold">
              {initial}
            </div>

            <h1 className="text-3xl font-bold text-white mt-4">
              {user.name}
            </h1>

            <p className="text-slate-300 mt-1">
              RoadWatch Account
            </p>
          </div>

          {/* Information */}
          <div className="p-8 space-y-6">
            <ProfileItem
              label="Full Name"
              value={user.name || "Unavailable"}
            />

            <ProfileItem
              label="Email Address"
              value={user.email || "Unavailable"}
            />

            <ProfileItem
              label="Account Role"
              value={
                user.role
                  ? user.role.charAt(0).toUpperCase() +
                    user.role.slice(1)
                  : "Citizen"
              }
            />

            {user.createdAt && (
              <ProfileItem
                label="Member Since"
                value={new Date(user.createdAt).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div className="border-b border-slate-200 pb-4">
      <p className="text-sm font-semibold text-slate-500">
        {label}
      </p>

      <p className="text-lg font-medium text-slate-900 mt-1">
        {value}
      </p>
    </div>
  );
}

export default Profile;