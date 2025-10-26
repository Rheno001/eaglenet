import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Quote from './pages/Quote/QuoteForm';
import Auth from './pages/Auth';
import Unauthorized from './pages/Unauthorized';

// Dashboard layout & pages
import DashboardLayout from './pages/Dashboard';
import Overview from './pages/Dashboard/pages/Overview';
import Requests from './pages/Dashboard/pages/Requests';
import Shipments from './pages/Dashboard/Shipments';
import Booking from './pages/Dashboard/Booking';
import Payments from './pages/Dashboard/Payments';
import Track from './pages/Dashboard/track';
import ManageAdmins from './pages/Dashboard/pages/ManageAdmins';

// Admin and Super Admin Dashboards
import AdminDashboard from './pages/admin';
import SuperAdminDashboard from './pages/superAdmin';

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/eaglenet/auth/admin') ||
    location.pathname.startsWith('/eaglenet/auth/superadmin');

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && <Navbar className="z-10" />}
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* User Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']} />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="requests" element={<Requests />} />
              <Route path="shipments" element={<Shipments />} />
              <Route path="booking" element={<Booking />} />
              <Route path="payments" element={<Payments />} />
              <Route path="track" element={<Track />} />
              <Route
                path="manage-admins"
                element={
                  <ProtectedRoute allowedRoles={['superadmin']}>
                    <ManageAdmins />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>

          {/* Admin Dashboard Route */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/eaglenet/auth/admin" element={<AdminDashboard />} />
          </Route>

          {/* Super Admin Dashboard Route */}
          <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
            <Route path="/eaglenet/auth/superadmin" element={<SuperAdminDashboard />} />
          </Route>

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