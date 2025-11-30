import { useState, useEffect, useContext } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Search,
  MapPin,
  User,
  X,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios"; // Re-adding axios for shipment fetching

export default function CustomerDashboard() {
  const [shipments, setShipments] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useContext(AuthContext); // Get user and authLoading from AuthContext

  // Fetch shipments
  const fetchShipments = async () => {
    try {
      const res = await axios.post(
        "http://localhost/backend/user.php", // Assuming this is the correct endpoint
        { email: user?.email }, // Use user email from context
        { headers: { "Content-Type": "application/json" } }
      );

      const data = res.data;
      if (data.success) {
        setShipments(data.shipments || []);
      } else {
        setShipments([]);
      }
    } catch (err) {
      console.error("Shipments fetch error:", err);
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) { // Only fetch shipments if user email is available
      fetchShipments();
    }
  }, [user?.email]); // Re-run when user email becomes available

  if (loading || authLoading) // Show loading if either auth or shipment data is loading
    return (
      <p className="text-center mt-20 text-gray-500">Loading dashboard...</p>
    );

  const getStatusBadge = (status) => {
    const base =
      "px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1";
    switch (status?.toLowerCase()) {
      case "delivered":
        return (
          <span className={`${base} bg-green-100 text-green-700`}>

          </span>
        );
      case "pending":
        return (
          <span className={`${base} bg-yellow-100 text-yellow-700`}>

          </span>
        );
      case "in transit":
        return (
          <span className={`${base} bg-blue-100 text-blue-700`}>

          </span>
        );
      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-600`}>Unknown</span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-gray-900 text-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-700 text-white flex items-center justify-center font-semibold text-xl">
              {user?.name?.[0]?.toUpperCase() || "J"}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Welcome, {user?.firstName || "Customer"}!
              </h1>
            </div>
          </div>
        </header>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            to="booking"
            className="bg-white border border-gray-200 text-gray-900 p-4 rounded-lg hover:border-gray-900 hover:shadow-md transition-all duration-200 flex items-center gap-3"
          >
            <Package className="w-6 h-6 text-teal-600" /> Create Shipment
          </Link>

          <Link
            to="shipments"
            className="bg-white border border-gray-200 text-gray-900 p-4 rounded-lg hover:border-gray-900 hover:shadow-md transition-all duration-200 flex items-center gap-3"
          >
            <Search className="w-6 h-6 text-blue-600" /> Track Shipment
          </Link>

          <Link
            to="/quote"
            className="bg-white border border-gray-200 text-gray-900 p-4 rounded-lg hover:border-gray-900 hover:shadow-md transition-all duration-200 flex items-center gap-3"
          >
            <MapPin className="w-6 h-6 text-orange-600" /> Get Quote
          </Link>

          <Link
            to="/contact"
            className="bg-white border border-gray-200 text-gray-900 p-4 rounded-lg hover:border-gray-900 hover:shadow-md transition-all duration-200 flex items-center gap-3"
          >
            <User className="w-6 h-6 text-purple-600" /> Contact Support
          </Link>
        </section>

        {/* Shipment Table */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Shipments
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              {/* <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Tracking ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Destination
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                </tr>
              </thead> */}

              <tbody className="divide-y divide-gray-200">
                {shipments.map((shipment) => (
                  <tr key={shipment.trackingId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      {shipment.trackingId}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {getStatusBadge(shipment.status)}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {shipment.destinationCity}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {shipment.date || shipment.created_at}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Link
            to="shipments"
            className="mt-4 inline-block text-gray-900 hover:text-gray-700 font-medium underline decoration-gray-300 hover:decoration-gray-900 underline-offset-4"
          >
            View All Shipments
          </Link>
        </section>

        {/* Account Info */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Account Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 font-medium">Name</p>
              <p className="text-gray-900 font-semibold">{user?.firstName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 font-medium">Email</p>
              <p className="text-gray-900 font-semibold">{user?.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 font-medium">Phone</p>
              <p className="text-gray-900 font-semibold">{user?.phone}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 font-medium">Billing Status</p>
              <p className="text-gray-900 font-semibold">
                No outstanding balance
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white rounded-xl p-6 text-center">
          <p className="text-sm mb-4">
            &copy; {new Date().getFullYear()} EagleNet Nigeria Logistics. All
            rights reserved.
          </p>

          <div className="flex justify-center gap-4">
            <a href="/faq" className="text-gray-400 hover:text-white transition-colors">
              FAQ
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms
            </a>
            <a href="/contact" className="text-gray-400 hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}