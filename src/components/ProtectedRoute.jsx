{/*import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ allowedRoles }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;*/}
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useContext(AuthContext);

  // ✅ Wait for authentication to complete
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-700 font-semibold">Verifying access...</p>
        </div>
      </div>
    );
  }

  // ✅ Not logged in → redirect to login
  if (!user) {
    console.log("❌ No user found, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  // ✅ Check if user's role is allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log(`❌ User role "${user.role}" not allowed. Required: ${allowedRoles.join(', ')}`);
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ All checks passed - render protected content
  console.log("✅ Access granted for role:", user.role);
  return <Outlet />;
}

export default ProtectedRoute;