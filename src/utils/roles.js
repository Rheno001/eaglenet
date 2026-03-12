export const ROLES = {
  USER: 'customer',
  ADMIN: 'admin',
  SUPER_ADMIN: 'superadmin',
};

export const MENU_ITEMS = {
  [ROLES.USER]: [
    { name: 'Overview', path: '/customer-dashboard' },
    { name: 'Shipments', path: '/customer-dashboard/shipments' },
    { name: 'Book Shipment', path: '/customer-dashboard/booking' },
    { name: 'Track Package', path: '/customer-dashboard/track' },
    { name: 'Payment', path: '/customer-dashboard/payment' },
  ],
  [ROLES.ADMIN]: [
    { name: 'Overview', path: '/admin-dashboard' },
    { name: 'Orders', path: '/admin-dashboard/orders' },
    { name: 'Book Shipment', path: '/admin-dashboard/booking' },
    { name: 'Users', path: '/admin-dashboard/users' },
    { name: 'Services', path: '/admin-dashboard/services' },
    { name: 'Reports', path: '/admin-dashboard/reports' },
    { name: 'Payment', path: '/admin-dashboard/payment' },
    { name: 'Notifications', path: '/admin-dashboard/notifications' },
    { name: 'Settings', path: '/admin-dashboard/settings' },
  ],
  [ROLES.SUPER_ADMIN]: [
    { name: 'Overview', path: '/admin-dashboard' },
    { name: 'Analytics', path: '/admin-dashboard/analytics' },
    { name: 'Orders', path: '/admin-dashboard/orders' },
    { name: 'Book Shipment', path: '/admin-dashboard/booking' },
    { name: 'Users', path: '/admin-dashboard/users' },
    { name: 'Services', path: '/admin-dashboard/services' },
    { name: 'Manage Admins', path: '/admin-dashboard/admins' },
    { name: 'Create Admin', path: '/admin-dashboard/create-admin' },
    { name: 'Promote Resident', path: '/admin-dashboard/promote' },
    { name: 'Reports', path: '/admin-dashboard/reports' },
    { name: 'Payment', path: '/admin-dashboard/payment' },
    { name: 'Notifications', path: '/admin-dashboard/notifications' },
    { name: 'Settings', path: '/admin-dashboard/settings' },
  ],
};