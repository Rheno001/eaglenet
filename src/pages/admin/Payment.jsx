import React, { useEffect, useState } from "react";

export default function Payment() {
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage] = useState(8); // Adjust per page

  // ✅ Fetch payments from backend
  const fetchPayments = () => {
    fetch("http://localhost/backend/get-payments.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") setPayments(data.payments);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Pagination logic
  const indexOfLast = currentPage * paymentsPerPage;
  const indexOfFirst = indexOfLast - paymentsPerPage;
  const currentPayments = payments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(payments.length / paymentsPerPage);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">Payment History</h2>

      {payments.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPayments.map((payment) => (
              <div
                key={payment.id}
                className="bg-white p-4 rounded-xl shadow-md border border-gray-200
                           transition transform hover:-translate-y-1 hover:shadow-xl
                           duration-300 ease-in-out"
              >
                <h3 className="font-bold text-gray-900 mb-2">
                  Payment ID: {payment.id}
                </h3>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">User:</span> {payment.userName || payment.userEmail}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">Amount:</span> ₦{payment.amount.toLocaleString()}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">Payment Method:</span> {payment.method}
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  <span className="font-semibold">Date:</span> {new Date(payment.date).toLocaleString()}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  <span className="font-semibold">Status:</span> {payment.status}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-purple-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                } transition duration-300 ease-in-out`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-600">No payment history found</p>
      )}
    </div>
  );
}
