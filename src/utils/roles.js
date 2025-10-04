export const ROLES = {
  USER: "user",
  ADMIN: "admin",
  SUPER_ADMIN: "super-admin",
};

export const MENU_ITEMS = {
  [ROLES.USER]: [
    { name: "Overview", path: "/dashboard" },
    { name: "My Shipments", path: "/dashboard/requests" },
  ],
  [ROLES.ADMIN]: [
    { name: "Overview", path: "/dashboard" },
    { name: "Requests", path: "/dashboard/requests" },
  ],
  [ROLES.SUPER_ADMIN]: [
    { name: "Overview", path: "/dashboard" },
    { name: "Requests", path: "/dashboard/requests" },
    { name: "Manage Admins", path: "/dashboard/manage-admins" },
  ],
};
