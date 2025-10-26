// ManageAdmins.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ email: '', firstName: '', lastName: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost/backend/admins.php');
        if (response.data.status === 'success') {
          setAdmins(response.data.admins);
        } else {
          setError('Failed to load admins');
        }
      } catch (err) {
        setError('Error fetching admins');
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost/backend/create-admin.php', newAdmin);
      if (response.data.status === 'success') {
        setAdmins([...admins, response.data.admin]);
        setNewAdmin({ email: '', firstName: '', lastName: '' });
      } else {
        setError('Failed to create admin');
      }
    } catch (err) {
      setError('Error creating admin');
    }
  };

  const handleRemoveAdmin = async (adminId) => {
    try {
      const response = await axios.post('http://localhost/backend/remove-admin.php', { adminId });
      if (response.data.status === 'success') {
        setAdmins(admins.filter(admin => admin.id !== adminId));
      } else {
        setError('Failed to remove admin');
      }
    } catch (err) {
      setError('Error removing admin');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Admins</h2>
      <p className="text-gray-600 mb-6">
        Only Super Admins can create or remove other admins.
      </p>

      <form onSubmit={handleCreateAdmin} className="mb-8">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="First Name"
            value={newAdmin.firstName}
            onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
            className="px-3 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={newAdmin.lastName}
            onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
            className="px-3 py-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={newAdmin.email}
            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
            className="px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Create New Admin
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-4">Existing Admins</h3>
      {admins.length > 0 ? (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id}>
                <td className="p-3">{admin.firstName} {admin.lastName}</td>
                <td className="p-3">{admin.email}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleRemoveAdmin(admin.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No admins found</p>
      )}
    </div>
  );
}