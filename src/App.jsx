import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";
import ResetPassword from "./components/ResetPassword";

// Public pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Quote from "./pages/Quote/QuoteForm";
import Auth from "./pages/Auth";
import Unauthorized from "./pages/Unauthorized";
import Track from "./pages/Track";

// USER Dashboard pages
// Dashboard pages (Consolidated)
import DashboardLayout from "./pages/Dashboard/Layout";
import Overview from "./pages/Dashboard/Overview";
import Shipments from "./pages/Dashboard/Shipments";
import Booking from "./pages/Dashboard/Booking";
import AdminOrders from "./pages/Dashboard/AdminOrders";
import AdminUsers from "./pages/Dashboard/AdminUsers";
import AdminReports from "./pages/Dashboard/AdminReports";
import AdminPayment from "./pages/Dashboard/AdminPayment";
import AdminNotifications from "./pages/Dashboard/AdminNotifications";
import AdminSettings from "./pages/Dashboard/AdminSettings";

// SUPER ADMIN Dashboard
import SuperAdminDashboard from "./pages/superAdmin/index";
import SuperAdminAdmins from "./pages/superAdmin/Admins";
import SuperAdminPromote from "./pages/superAdmin/PromoteUser";

function App() {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const isDashboard = location.pathname.startsWith("/dashboard");

  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  // ✅ Redirect logged-in users away from login/signup to a single dashboard entry
  if (parsedUser && (location.pathname === "/login" || location.pathname === "/signup")) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && <Navbar className="z-10" />}
      <main className="flex-1">
        <Routes>
          {/* ✅ PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/reset-password" element={<ResetPassword />} /> {/* ✅ Moved here */}
          <Route path="/track/:trackingId?" element={<Track />} />

          {/* ✅ UNIFIED DASHBOARD SYSTEM */}
          <Route element={<ProtectedRoute allowedRoles={["user", "admin", "superadmin"]} />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              
              {/* Common / User specific */}
              <Route path="shipments" element={<Shipments />} />
              <Route path="booking" element={<Booking />} />
              <Route path="track/:trackingId?" element={<Track />} />
              <Route path="payment" element={<AdminPayment />} /> {/* Shared payment for now */}

              {/* Admin specific routes */}
              <Route element={<ProtectedRoute allowedRoles={["admin", "superadmin"]} />}>
                <Route path="admin/orders" element={<AdminOrders />} />
                <Route path="admin/users" element={<AdminUsers />} />
                <Route path="admin/reports" element={<AdminReports />} />
                <Route path="admin/payment" element={<AdminPayment />} />
                <Route path="admin/notifications" element={<AdminNotifications />} />
                <Route path="admin/settings" element={<AdminSettings />} />
              </Route>

              {/* Super Admin specific routes */}
              <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
                <Route path="superadmin/admins" element={<SuperAdminAdmins />} />
                <Route path="superadmin/promote" element={<SuperAdminPromote />} />
                <Route path="superadmin/analytics" element={<SuperAdminDashboard />} />
              </Route>
            </Route>
          </Route>

          {/* ✅ CATCH-ALL */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <ScrollToTop />
      <App />
    </Router>
  );
}
