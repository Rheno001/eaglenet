// SuperAdminAnalytics.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default function index() {
  const mockOrderData = [
    { date: '2025-10-01', orders: 100 },
    // More data
  ];
  const mockStats = [
    { label: 'Registered Users', value: 500 },
    { label: 'Pending Orders', value: 50 },
    { label: 'Delivered Orders', value: 300 },
  ];
  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        {mockStats.map(stat => (
          <div key={stat.label} className="bg-white p-4 rounded shadow">
            <p>{stat.label}</p>
            <p className="text-2xl">{stat.value}</p>
          </div>
        ))}
      </div>
      <LineChart width={800} height={400} data={mockOrderData}>
        <Line type="monotone" dataKey="orders" stroke="#8884d8" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </div>
  );
}