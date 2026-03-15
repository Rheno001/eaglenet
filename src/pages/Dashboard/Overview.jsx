import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import CustomerOverview from './CustomerOverview';
import AdminOverview from './AdminOverview';

export default function Overview() {
  const { user } = useContext(AuthContext);

  if (user?.role === 'admin' || user?.role === 'superadmin') {
    return <AdminOverview />;
  }

  return <CustomerOverview />;
}
