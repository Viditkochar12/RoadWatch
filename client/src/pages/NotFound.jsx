import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
      <div className="text-center">

        <h1 className="text-8xl font-black text-yellow-400">
          404
        </h1>

        <h2 className="text-4xl font-bold text-slate-900 mt-4">
          Page Not Found
        </h2>

        <p className="text-slate-600 mt-4 max-w-md mx-auto">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <Link
          to="/"
          className="inline-block mt-8 bg-yellow-400 text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 transition"
        >
          ⬅ Back to Home
        </Link>

      </div>
    </div>
  );
}

export default NotFound;