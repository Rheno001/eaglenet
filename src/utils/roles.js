export const ROLES = {
  USER: 'customer',
  ADMIN: 'admin',
  SUPER_ADMIN: 'superadmin',
};

export const MENU_ITEMS = {
  [ROLES.USER]: [
    { name: 'Home', path: '/customer-dashboard' },
    { name: 'Shipment', path: '/customer-dashboard/shipments' },
    { name: 'Booking', path: '/customer-dashboard/booking' },
    { name: 'Track Shipment', path: '/customer-dashboard/track' },
    { name: 'Payment', path: '/customer-dashboard/payment' },
  ],
  [ROLES.ADMIN]: [
    { name: 'Home', path: '/admin-dashboard' },
    { name: 'Order', path: '/admin-dashboard/orders' },
    { name: 'Booking', path: '/admin-dashboard/booking' },
    { name: 'User', path: '/admin-dashboard/users' },
    { name: 'Services', path: '/admin-dashboard/services' },
    { name: 'Reports', path: '/admin-dashboard/reports' },
    { name: 'Payment', path: '/admin-dashboard/payment' },
    { name: 'Notifications', path: '/admin-dashboard/notifications' },
    { name: 'Settings', path: '/admin-dashboard/settings' },
  ],
  [ROLES.SUPER_ADMIN]: [
    { name: 'Home', path: '/admin-dashboard' },
    { name: 'Global Networks', path: '/admin-dashboard/analytics' },
    { name: 'Order', path: '/admin-dashboard/orders' },
    { name: 'Booking', path: '/admin-dashboard/booking' },
    { name: 'User', path: '/admin-dashboard/users' },
    { name: 'Services', path: '/admin-dashboard/services' },
    { name: 'Admin Management', path: '/admin-dashboard/admins' },
    { name: 'Reports', path: '/admin-dashboard/reports' },
    { name: 'Payment', path: '/admin-dashboard/payment' },
    { name: 'Notifications', path: '/admin-dashboard/notifications' },
    { name: 'Settings', path: '/admin-dashboard/settings' },
  ],
};