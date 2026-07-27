import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const isLoggedIn = Boolean(token);
  const isAdmin = role === "admin";

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    setMenuOpen(false);
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-3"
          >
            <img
              src="/RoadWatchLogo.png"
              alt="RoadWatch Logo"
              className="h-10 w-10 object-contain"
            />

            <span className="text-2xl font-extrabold tracking-wide">
              <span className="text-white">Road</span>
              <span className="text-yellow-400">Watch</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="hover:text-yellow-400 transition-colors"
            >
              Home
            </Link>

            <Link
              to="/reports"
              className="hover:text-yellow-400 transition-colors"
            >
              Reports
            </Link>

            <Link
              to="/create-report"
              className="hover:text-yellow-400 transition-colors"
            >
              Report Damage
            </Link>

            {isLoggedIn && (
              <Link
                to="/my-reports"
                className="hover:text-yellow-400 transition-colors"
              >
                My Reports
              </Link>
            )}

            {isLoggedIn && (
              <Link
                to="/profile"
                className="hover:text-yellow-400 transition-colors"
              >
                Profile
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="hover:text-yellow-400 transition-colors"
              >
                Admin
              </Link>
            )}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-yellow-400 text-slate-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-3xl cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-700 py-4 flex flex-col gap-2">
            <Link
              to="/"
              onClick={closeMenu}
              className="px-3 py-3 rounded-lg hover:bg-slate-800 hover:text-yellow-400"
            >
              Home
            </Link>

            <Link
              to="/reports"
              onClick={closeMenu}
              className="px-3 py-3 rounded-lg hover:bg-slate-800 hover:text-yellow-400"
            >
              Reports
            </Link>

            {isLoggedIn && (
              <Link
                to="/my-reports"
                onClick={closeMenu}
                className="px-3 py-3 rounded-lg hover:bg-slate-800 hover:text-yellow-400"
              >
                My Reports
              </Link>
            )}

            {isLoggedIn && (
              <Link
                to="/profile"
                onClick={closeMenu}
                className="px-3 py-3 rounded-lg hover:bg-slate-800 hover:text-yellow-400"
              >
                Profile
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={closeMenu}
                className="px-3 py-3 rounded-lg hover:bg-slate-800 hover:text-yellow-400"
              >
                Admin Dashboard
              </Link>
            )}

            <Link
              to="/create-report"
              onClick={closeMenu}
              className="px-3 py-3 rounded-lg hover:bg-slate-800 hover:text-yellow-400"
            >
              Report Damage
            </Link>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="mt-2 bg-red-500 py-3 rounded-lg font-semibold hover:bg-red-600 cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="mt-2 bg-yellow-400 text-slate-900 text-center py-3 rounded-lg font-semibold hover:bg-yellow-300"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;