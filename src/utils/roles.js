export const ROLES = {
  USER: 'customer',
  ADMIN: 'admin',
  SUPER_ADMIN: 'superadmin',
};

export const MENU_ITEMS = {
  [ROLES.USER]: [
    { name: 'Overview', path: '/dashboard' },
    { name: 'Shipments', path: '/dashboard/shipments' },
    { name: 'Book Shipment', path: '/dashboard/booking' },
    { name: 'Track Package', path: '/dashboard/track' },
    { name: 'Payment', path: '/dashboard/payment' },
  ],
  [ROLES.ADMIN]: [
    { name: 'Overview', path: '/dashboard' },
    { name: 'Orders', path: '/dashboard/admin/orders' },
    { name: 'Users', path: '/dashboard/admin/users' },
    { name: 'Reports', path: '/dashboard/admin/reports' },
    { name: 'Payment', path: '/dashboard/admin/payment' },
    { name: 'Notifications', path: '/dashboard/admin/notifications' },
    { name: 'Settings', path: '/dashboard/admin/settings' },
  ],
  [ROLES.SUPER_ADMIN]: [
    { name: 'Overview', path: '/dashboard' },
    { name: 'Analytics', path: '/dashboard/superadmin/analytics' },
    { name: 'Orders', path: '/dashboard/admin/orders' },
    { name: 'Users', path: '/dashboard/admin/users' },
    { name: 'Manage Admins', path: '/dashboard/superadmin/admins' },
    { name: 'Add Admin', path: '/dashboard/superadmin/promote' },
    { name: 'Reports', path: '/dashboard/admin/reports' },
    { name: 'Payment', path: '/dashboard/admin/payment' },
    { name: 'Notifications', path: '/dashboard/admin/notifications' },
    { name: 'Settings', path: '/dashboard/admin/settings' },
  ],
};