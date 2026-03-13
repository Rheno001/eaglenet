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

  // ✅ Debugging logs for transparency
  console.log("🛡️ [Auth Guard Check]", {
    identity: user ? `${user.firstName} (${user.role})` : 'Unauthenticated',
    allowed: allowedRoles,
    status: loading ? 'Verifying...' : 'Complete',
    decision: user && allowedRoles?.some(r => r.toLowerCase() === user.role?.toLowerCase()) ? 'GRANTED' : 'DENIED'
  });

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-900 border-t-transparent shadow-lg text-slate-900"></div>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Authorizing Secure Channel...</p>
        </div>
      </div>
    );
  }

  // ✅ Not logged in or state lost → redirect to login
  if (!user) {
    console.error("❌ Auth State Null. Redirecting to Login Profile.");
    return <Navigate to="/login" replace />;
  }

  // ✅ Strict Role comparison (Case-Insensitive)
  const userRole = user.role?.toLowerCase();
  const authorized = allowedRoles ? allowedRoles.some(role => role.toLowerCase() === userRole) : true;

  if (!authorized) {
    console.warn(`❌ Privilege Violation: Role "${userRole}" lacks entry to ${allowedRoles.join('/')}`);
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;