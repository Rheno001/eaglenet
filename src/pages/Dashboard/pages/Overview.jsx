// Overview.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import axios from 'axios';
import { ROLES } from '../../../utils/roles';

export default function Overview() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        let endpoint = '';
        if (user.role === ROLES.USER) {
          endpoint = `http://localhost/backend/user-stats.php?userId=${user.id}`;
        } else if (user.role === ROLES.ADMIN || user.role === ROLES.SUPER_ADMIN) {
          endpoint = `http://localhost/backend/admin-stats.php`;
        }

        const response = await axios.get(endpoint);
        if (response.data.status === 'success') {
          setStats(response.data.stats);
          if (user.role === ROLES.USER) {
            setShipments(response.data.shipments || []);
          }
        } else {
          setError('Failed to load stats');
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.firstName}</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white p-4 rounded shadow">
            <p>{stat.label}</p>
            <p className="text-2xl">{stat.value}</p>
          </div>
        ))}
      </div>
      {user.role === ROLES.USER && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Recent Shipments</h3>
          {shipments.length > 0 ? (
            <table className="w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Tracking ID</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Destination</th>
                </tr>
              </thead>
              <tbody>
                {shipments.slice(0, 5).map(shipment => (
                  <tr key={shipment.trackingId}>
                    <td className="p-3">{shipment.trackingId}</td>
                    <td className="p-3">{shipment.status}</td>
                    <td className="p-3">{shipment.destination}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No recent shipments</p>
          )}
        </div>
      )}
      {(user.role === ROLES.ADMIN || user.role === ROLES.SUPER_ADMIN) && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Admin Summary</h3>
          <p>Additional admin-specific metrics or actions can go here.</p>
        </div>
      )}
    </div>
  );
}