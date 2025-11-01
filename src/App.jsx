import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Quote from "./pages/Quote/QuoteForm";
import Auth from "./pages/Auth"; // login/signup page

// Dashboard layout & subpages
import DashboardLayout from "./pages/Dashboard"; // layout with sidebar/topbar
import Overview from "./pages/Dashboard/pages/Overview";
import Requests from "./pages/Dashboard/pages/Requests";
import ManageAdmins from "./pages/Dashboard/pages/ManageAdmins";

// --- Protected Route Component ---
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to a more appropriate page, e.g., dashboard home
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        {/* Only show Navbar/Footer on public pages */}
        {!isDashboard && <Navbar />}

        <main className="flex-1">
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="/login" element={<Auth />} />

            {/* --- Protected Dashboard Routes --- */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["USER", "ADMIN", "SUPER_ADMIN"]}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route path="requests" element={
                <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                  <Requests />
                </ProtectedRoute>
              } />
              <Route
                path="manage-admins"
                element={
                  <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                    <ManageAdmins />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </main>

        {/* Footer hidden on dashboard */}
        {!isDashboard && <Footer />}
      </div>
    </>
  );
}

export default App;
