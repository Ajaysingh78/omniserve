import { useCurrentUser } from "./useCurrentUser";

export const usePermissions = () => {
  const user = useCurrentUser();

  const role = user?.role;

  return {
    role,

    isAuthenticated: !!user,

    isSuperAdmin: role === "SUPER_ADMIN",

    isRestaurantOwner:
      role === "RESTAURANT_OWNER",

    isOutletManager:
      role === "OUTLET_MANAGER",

    isKitchenStaff:
      role === "STAFF",

    canManageRestaurants:
      role === "SUPER_ADMIN",

    canManageOutlets:
      role === "SUPER_ADMIN" ||
      role === "RESTAURANT_OWNER",

    canManageInventory:
      role === "RESTAURANT_OWNER" ||
      role === "OUTLET_MANAGER",

    canManageOrders:
      role === "RESTAURANT_OWNER" ||
      role === "OUTLET_MANAGER" ||
      role === "STAFF",

    canManageStaff:
      role === "SUPER_ADMIN" ||
      role === "RESTAURANT_OWNER",

    canViewAnalytics:
      role === "SUPER_ADMIN" ||
      role === "RESTAURANT_OWNER" ||
      role === "OUTLET_MANAGER",

    canViewFinance:
      role === "SUPER_ADMIN" ||
      role === "RESTAURANT_OWNER",
  };
};