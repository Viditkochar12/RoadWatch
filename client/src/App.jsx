import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Reports from "./pages/Reports";
import CreateReport from "./pages/CreateReport";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyReports from "./pages/MyReports";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import ConceptsHub from "./pages/ConceptsHub";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";

// AppLayout is rendered inside BrowserRouter so route changes keep auth props synchronized
function AppLayout() {
  // Re-sync auth state when route changes (e.g. after login/logout navigation)
  useLocation();

  // Read stored credentials from localStorage
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isLoggedIn = Boolean(token);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Passing userRole and isLoggedIn as props to demonstrate React component composition */}
      <Navbar isLoggedIn={isLoggedIn} userRole={role} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/create-report" element={<CreateReport />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/concepts" element={<ConceptsHub />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;