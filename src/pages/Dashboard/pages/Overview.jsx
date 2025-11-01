import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";

const Overview = () => {
  const { user, token, loading: authLoading } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost/backend/";

  const fetchStats = async () => {
    if (authLoading) return; // Wait for auth to complete
    
    if (!user?.id || !token) {
      setError("Please log in to view your stats");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BACKEND_URL}/user-stats.php?userId=${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setStats(response.data.stats);
      } else {
        setError(response.data.error || "Failed to fetch stats");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Error fetching stats");
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]); // ✅ only call when user is available

  return (
    <div className="p-4">
      {authLoading ? (
        <p>Loading authentication...</p>
      ) : !user ? (
        <p className="text-red-500">Please log in to view your stats</p>
      ) : loading ? (
        <p>Loading stats...</p>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : stats ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Welcome, {user.firstName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">Total Shipments</h3>
              <p className="text-2xl">{stats.total_shipments || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">Pending</h3>
              <p className="text-2xl">{stats.pending_shipments || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">Active</h3>
              <p className="text-2xl">{stats.active_shipments || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">Completed</h3>
              <p className="text-2xl">{stats.completed_shipments || 0}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>No stats available</p>
      )}
    </div>
  );
};

export default Overview;