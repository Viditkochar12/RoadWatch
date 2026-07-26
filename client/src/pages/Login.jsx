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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🚧</div>

          <h1 className="text-3xl font-bold text-slate-900">
            Welcome Back
          </h1>

          <p className="text-slate-500 mt-2">
            Login to your RoadWatch account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-slate-900 font-bold py-3 rounded-xl hover:bg-yellow-300 transition cursor-pointer"
          >
            Login
          </button>

        </form>

        <p className="text-center text-slate-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-yellow-600 font-semibold hover:underline"
          >
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;