// Requests.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost/backend/requests.php');
        if (response.data.status === 'success') {
          setRequests(response.data.requests);
        } else {
          setError('Failed to load requests');
        }
      } catch (err) {
        setError('Error fetching requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAction = async (requestId, action) => {
    try {
      const response = await axios.post('http://localhost/backend/request-action.php', {
        requestId,
        action, // 'approve' or 'reject'
      });
      if (response.data.status === 'success') {
        setRequests(requests.filter(req => req.id !== requestId));
      } else {
        setError('Failed to process request');
      }
    } catch (err) {
      setError('Error processing request');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Shipment Requests</h2>
      {requests.length > 0 ? (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Request ID</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Details</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(request => (
              <tr key={request.id}>
                <td className="p-3">{request.id}</td>
                <td className="p-3">{request.userName}</td>
                <td className="p-3">{request.details}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleAction(request.id, 'approve')}
                    className="px-3 py-1 bg-green-600 text-white rounded mr-2 hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(request.id, 'reject')}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pending requests</p>
      )}
    </div>
  );
}