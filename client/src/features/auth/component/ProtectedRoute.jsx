import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = localStorage.getItem("accessToken");

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
