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
import Solutions from "./pages/Solutions";
import Contact from "./pages/Contact";
import Quote from "./pages/Quote/QuoteForm";
import Auth from "./pages/Auth";
import Unauthorized from "./pages/Unauthorized";
import Track from "./pages/Track";

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
import AdminServices from "./pages/Dashboard/AdminServices";
import UserPayments from "./pages/Dashboard/UserPayments";

// SUPER ADMIN Dashboard
import SuperAdminDashboard from "./pages/superAdmin/index";
import SuperAdminAdmins from "./pages/superAdmin/Admins";
import SuperAdminPromote from "./pages/superAdmin/PromoteUser";
import CreateAdmin from "./pages/superAdmin/CreateAdmin";

function App() {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const isDashboard = location.pathname.includes("dashboard");

  // ✅ Redirect logged-in users away from login/signup to their specific dashboard
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  if (parsedUser && (location.pathname === "/login" || location.pathname === "/signup")) {
    const redirectPath = parsedUser.role?.toLowerCase() === 'customer' ? '/customer-dashboard' : '/admin-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && <Navbar className="z-10" />}
      <main className="flex-1">
        <Routes>
          {/* ✅ PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/track/:trackingId?" element={<Track />} />

          {/* ✅ CUSTOMER DASHBOARD SYSTEM */}
          <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
            <Route path="/customer-dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="shipments" element={<Shipments />} />
              <Route path="booking" element={<Booking />} />
              <Route path="track/:trackingId?" element={<Track />} />
              <Route path="payment" element={<UserPayments />} />
            </Route>
          </Route>

          {/* ✅ ADMIN & SUPERADMIN DASHBOARD SYSTEM */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "superadmin"]} />}>
            <Route path="/admin-dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="booking" element={<Booking />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="payment" element={<AdminPayment />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="settings" element={<AdminSettings />} />
              
              {/* Specialized nesting */}
              <Route path="admins" element={<SuperAdminAdmins />} />
              <Route path="promote" element={<SuperAdminPromote />} />
              <Route path="create-admin" element={<CreateAdmin />} />
            </Route>
          </Route>

          {/* Legacy Redirect */}
          <Route path="/dashboard" element={<Navigate to={user?.role === 'customer' ? '/customer-dashboard' : '/admin-dashboard'} replace />} />

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
