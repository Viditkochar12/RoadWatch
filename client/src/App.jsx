import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />

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
    </BrowserRouter>
  );
}

export default App;