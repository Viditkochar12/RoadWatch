import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
     
      alert("Login successful!");

      navigate("/create-report");
    } catch (error) {
      console.error(error);
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-white via-sky-50 to-blue-50 overflow-hidden flex items-center justify-center px-4 py-12">

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
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative animate-[fadeIn_0.5s_ease-out]">
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-100 p-8 sm:p-10">

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-amber-300 text-xs font-semibold tracking-widest uppercase shadow-sm mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
              Welcome Back
            </div>

            <div className="text-5xl mb-3">🚧</div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Sign in to RoadWatch
            </h1>

            <p className="text-slate-500 mt-3">
              Access your account to report and manage road issues.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block font-semibold text-slate-700 mb-2 text-sm">
                Email Address
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  ✉️
                </span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-14 border border-slate-200 rounded-xl pl-11 pr-4 bg-slate-50 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-2 text-sm">
                Password
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔒
                </span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-14 border border-slate-200 rounded-xl pl-11 pr-4 bg-slate-50 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-900 font-bold py-4 rounded-full shadow-lg shadow-amber-400/30 hover:shadow-xl hover:shadow-amber-400/40 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              Login
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>

          </form>

          <p className="text-center text-slate-600 mt-7">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-amber-600 font-semibold hover:text-amber-700 hover:underline transition"
            >
              Create Account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;