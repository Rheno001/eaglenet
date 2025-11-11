import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";

// Public pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Quote from "./pages/Quote/QuoteForm";
import Auth from "./pages/Auth";
import Unauthorized from "./pages/Unauthorized";

// USER Dashboard pages
import DashboardLayout from "./pages/Dashboard/Layout";
import Overview from "./pages/Dashboard/index";
import Shipments from "./pages/Dashboard/Shipments";
import Booking from "./pages/Dashboard/Booking";
import Payments from "./pages/Dashboard/Payments";
import Track from "./pages/Dashboard/track";

// ADMIN Dashboard pages
import AdminLayout from "./pages/admin/Layout";
import AdminDashboard from "./pages/admin";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";
import AdminReports from "./pages/admin/Reports";
import AdminPayment from "./pages/admin/Payment";
import AdminNotifications from "./pages/admin/Notifications";
import AdminSettings from "./pages/admin/Settings";

// SUPER ADMIN Dashboard
import SuperAdminDashboard from "./pages/superAdmin";

function App() {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const isDashboard =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/eaglenet/auth/admin") ||
    location.pathname.startsWith("/eaglenet/auth/superadmin");

  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  // ✅ If logged in and tries to visit login/signup, redirect
  if (parsedUser && (location.pathname === "/login" || location.pathname === "/signup")) {
    if (parsedUser.role === "superadmin") return <Navigate to="/eaglenet/auth/superadmin" replace />;
    if (parsedUser.role === "admin") return <Navigate to="/eaglenet/auth/admin" replace />;
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

          {/* ✅ USER DASHBOARD — ONLY ROLE = user */}
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="shipments" element={<Shipments />} />
              <Route path="booking" element={<Booking />} />
              <Route path="payments" element={<Payments />} />
              <Route path="track" element={<Track />} />
            </Route>
          </Route>

          {/* ✅ ADMIN DASHBOARD */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "superadmin"]} />}>
            <Route path="/eaglenet/auth/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* ✅ SUPER ADMIN DASHBOARD */}
          <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
            <Route path="/eaglenet/auth/superadmin" element={<SuperAdminDashboard />} />
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
