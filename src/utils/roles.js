export const ROLES = {
  USER: 'customer',
  ADMIN: 'admin',
  SUPER_ADMIN: 'superadmin',
};

export const MENU_ITEMS = {
  [ROLES.USER]: [
    { name: 'Home', path: '/customer-dashboard' },
    { name: 'My Shipments', path: '/customer-dashboard/shipments' },
    { name: 'New Shipment', path: '/customer-dashboard/booking' },
    { name: 'Track', path: '/customer-dashboard/track' },
    { name: 'Payments', path: '/customer-dashboard/payment' },
  ],
  [ROLES.ADMIN]: [
    { name: 'Dashboard', path: '/admin-dashboard' },
    { name: 'All Shipments', path: '/admin-dashboard/orders' },
    { name: 'New Shipment', path: '/admin-dashboard/booking' },
    { name: 'Users', path: '/admin-dashboard/users' },
    { name: 'Our Services', path: '/admin-dashboard/services' },
    { name: 'Reports', path: '/admin-dashboard/reports' },
    { name: 'Payments', path: '/admin-dashboard/payment' },
    { name: 'Notifications', path: '/admin-dashboard/notifications' },
    { name: 'Settings', path: '/admin-dashboard/settings' },
  ],
  [ROLES.SUPER_ADMIN]: [
    { name: 'Dashboard', path: '/admin-dashboard' },
    { name: 'All Shipments', path: '/admin-dashboard/orders' },
    { name: 'New Shipment', path: '/admin-dashboard/booking' },
    { name: 'Users', path: '/admin-dashboard/users' },
    { name: 'Our Services', path: '/admin-dashboard/services' },
    { name: 'Manage Admins', path: '/admin-dashboard/admins' },
    { name: 'Give Access', path: '/admin-dashboard/assign-access' },
    { name: 'User Access', path: '/admin-dashboard/roles-permissions' },
    { name: 'Departments', path: '/admin-dashboard/departments' },
    { name: 'Reports', path: '/admin-dashboard/reports' },
    { name: 'Payments', path: '/admin-dashboard/payment' },
    { name: 'Notifications', path: '/admin-dashboard/notifications' },
    { name: 'Settings', path: '/admin-dashboard/settings' },
  ],
};