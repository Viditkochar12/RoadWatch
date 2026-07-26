import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-black text-yellow-400">
          404
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mt-4">
          Page Not Found
        </h1>

        <p className="text-slate-600 mt-3 mb-8">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="inline-block bg-slate-900 text-white font-semibold px-6 py-3 rounded-xl hover:bg-slate-800 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;