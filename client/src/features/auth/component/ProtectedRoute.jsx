import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axiosInstance from "@/services/axios";
import { setUser, logout } from "../authSlice";

export default function ProtectedRoute() {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(!user && !!token);

  useEffect(() => {
    if (!user && token) {
      const restoreSession = async () => {
        try {
          const res = await axiosInstance.get("/auth/me");
          if (res.data && res.data.data) {
            dispatch(
              setUser({
                user: res.data.data,
                accessToken: token,
                refreshToken: localStorage.getItem("refreshToken"),
              })
            );
          } else {
            dispatch(logout());
          }
        } catch (err) {
          console.error("Session restore failed", err);
          dispatch(logout());
        } finally {
          setLoading(false);
        }
      };
      restoreSession();
    }
  }, [user, token, dispatch]);

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--bg)", color: "var(--text3)" }}>
        <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <div style={{ marginTop: 16, fontSize: 13, fontWeight: 500 }}>Initializing FoodMesh OS...</div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <Outlet />;
}
