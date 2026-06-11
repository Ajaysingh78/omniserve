import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RoleGuard({ allowedRoles, children }) {
  const user = useSelector((state) => state.auth.user);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role; // e.g. 'superAdmin', 'restaurantOwner', 'outletManager', 'kitchenStaff'

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
