import React from "react";

export default function Shipments() {
  const shipments = [
    { id: 1, status: "In Transit", destination: "Lagos", payment: "Pending" },
    { id: 2, status: "Delivered", destination: "Abuja", payment: "Completed" },
    { id: 3, status: "Pending", destination: "Port Harcourt", payment: "Pending" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Shipments</h1>
      <table className="w-full text-left border border-gray-300 rounded-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border-b">ID</th>
            <th className="px-4 py-2 border-b">Status</th>
            <th className="px-4 py-2 border-b">Destination</th>
            <th className="px-4 py-2 border-b">Payment</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((s) => (
            <tr key={s.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border-b">{s.id}</td>
              <td className="px-4 py-2 border-b">{s.status}</td>
              <td className="px-4 py-2 border-b">{s.destination}</td>
              <td className="px-4 py-2 border-b">{s.payment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
