export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'superadmin', // Match Auth.jsx
};

export const MENU_ITEMS = {
  [ROLES.USER]: [
    { name: 'Overview', path: '/dashboard' },
    { name: 'My Requests', path: '/dashboard/requests' },
    { name: 'Shipments', path: '/dashboard/shipments' },
    { name: 'Book Shipment', path: '/dashboard/booking' },
    { name: 'Track Package', path: '/dashboard/track' },
    { name: 'Payment', path: '/dashboard/payment' },
  ],
  [ROLES.ADMIN]: [
    { name: 'Overview', path: '/dashboard' },
    { name: 'All Requests', path: '/dashboard/requests' },
    { name: 'Shipments', path: '/dashboard/shipments' },
    { name: 'Admin Panel', path: '/eaglenet/auth/admin' },
    { name: 'Payment', path: '/dashboard/payment' },
  ],
  [ROLES.SUPER_ADMIN]: [
    { name: 'Overview', path: '/dashboard' },
    { name: 'All Requests', path: '/dashboard/requests' },
    { name: 'Shipments', path: '/dashboard/shipments' },
    { name: 'Manage Admins', path: '/dashboard/manage-admins' },
    { name: 'Super Admin Panel', path: '/eaglenet/auth/superadmin' },
    { name: 'Payment', path: '/dashboard/payment' }
  ],
};