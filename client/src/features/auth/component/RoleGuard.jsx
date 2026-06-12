import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RoleGuard({ allowedRoles, children }) {
  const user = useSelector((state) => state.auth.user);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role; // e.g. 'SUPER_ADMIN', 'RESTAURANT_OWNER', 'OUTLET_MANAGER', 'STAFF'

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
