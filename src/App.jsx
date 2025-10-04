import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Quote from "./pages/Quote/QuoteForm";
import Auth from "./pages/Auth/Dashboard"; // Login/Signup page

// Dashboard components
import Dashboard from "./pages/Auth/Dashboard";
import Overview from "./pages/Auth/Dashboard/pages/Overview";
import Requests from "./pages/Auth/Dashboard/pages/Requests";
import ManageAdmins from "./pages/Auth/Dashboard/pages/ManageAdmins";

// --- Protected Route Component ---
function ProtectedRoute({ element: Component, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user"));
  
  // Not logged in
  if (!user) return <Navigate to="/login" replace />;
  
  // Not authorized
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  return Component;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navbar only for public pages */}
        <Navbar />

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
                <ProtectedRoute
                  element={<Dashboard />}
                  allowedRoles={["user", "admin", "super-admin"]}
                />
              }
            >
              <Route index element={<Overview />} />
              <Route path="requests" element={<Requests />} />
              <Route
                path="manage-admins"
                element={
                  <ProtectedRoute
                    element={<ManageAdmins />}
                    allowedRoles={["super-admin"]}
                  />
                }
              />
            </Route>
          </Routes>
        </main>

        {/* Footer only for public pages */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
