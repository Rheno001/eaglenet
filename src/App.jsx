import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Public pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Quote from "./pages/Quote/QuoteForm";
import Auth from "./pages/Auth";

// Dashboard layout & pages
import DashboardLayout from "./pages/Dashboard"; // layout with sidebar/topbar
import Overview from "./pages/Dashboard/pages/Overview";
import Requests from "./pages/Dashboard/pages/Requests";
import Shipments from "./pages/Dashboard/Shipments";

import ManageAdmins from "./pages/Dashboard/pages/ManageAdmins";

// --- Protected Route Component ---
function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  const isDashboard = window.location.pathname.startsWith("/dashboard");

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        {/* Navbar/Footer only for public pages */}
        {!isDashboard && <Navbar />}

        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="/login" element={<Auth />} />

            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["user", "admin", "super-admin"]}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route path="requests" element={<Requests />} />
              <Route path="shipments" element={<Shipments />} />
              <Route
                path="manage-admins"
                element={
                  <ProtectedRoute allowedRoles={["super-admin"]}>
                    <ManageAdmins />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch-all redirect for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {!isDashboard && <Footer />}
      </div>
    </Router>
  );
}

export default App;
