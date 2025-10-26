// track.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { ROLES } from '../../utils/roles';

export default function Tracking() {
  const { user } = useContext(AuthContext);
  const [trackingId, setTrackingId] = useState('');
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    setShipment(null);
    setError('');

    if (!trackingId.trim()) {
      setError('Please enter a Tracking ID');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({ tracking_id: trackingId });
      if (user.role === ROLES.USER) {
        params.append('userId', user.id);
      }
      const response = await axios.get(
        `http://localhost/backend/track.php?${params.toString()}`
      );

      if (response.data && response.data.status === 'success') {
        setShipment(response.data.data);
        setError('');
      } else if (response.data && response.data.message) {
        setError(response.data.message);
      } else {
        setError('Shipment not found or invalid response from server.');
      }
    } catch (err) {
      console.error(err);
      setError('Error fetching shipment. Check your backend and tracking ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Track Your Shipment</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter Tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
        <button
          onClick={handleTrack}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Track'}
        </button>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {shipment && (
        <div className="bg-white border rounded p-4">
          <h3 className="font-bold mb-2">Status: {shipment.status || 'Pending'}</h3>
          <div className="text-sm text-gray-700">
            <p><strong>Pickup:</strong> {shipment.pickupAddress || shipment.pickup_address || '—'}</p>
            <p><strong>Destination:</strong> {shipment.destination || '—'}</p>
            <p><strong>Date:</strong> {shipment.date || '—'}</p>
            <p><strong>Details:</strong> {shipment.packageDetails || shipment.package_details || '—'}</p>
            <p><strong>Tracking ID:</strong> {shipment.trackingId || shipment.tracking_id || shipment.tracking || '—'}</p>
          </div>
        </div>
      )}
    </div>
  );
}