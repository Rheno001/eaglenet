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

    // Example alert
    setAlerts([
      {
        id: 1,
        message: "Shipment EGL-123 delayed due to weather",
        type: "warning",
      },
    ]);
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
    <div>Hello</div>
  )
}

export default Index