import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import LandingPage from "./features/landing/pages/LandingPage";

// Dashboards and layouts
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import DashboardLayout from "./features/dashboard/components/DashboardLayout";
import SuperAdminDashboard from "./features/dashboard/pages/SuperAdminDashboard";
import OwnerDashboard from "./features/dashboard/pages/OwnerDashboard";

// New features
import OrderPage from "./features/orders/pages/OrderPage";
import OfflinePOSPage from "./features/orders/pages/OfflinePOSPage";
import InventoryDashboard from "./features/inventory/pages/InventoryDashboard";
import AnalyticsPage from "./features/analytics/pages/AnalyticsPage";
import PlanManagement from "./features/subscriptions/pages/PlanManagement";
import AuditLogsPage from "./features/admin/pages/AuditLogsPage";
import WebhookLogsPage from "./features/admin/pages/WebhookLogsPage";
import CustomerDirectory from "./features/crm/pages/CustomerDirectory";

// Guard rails
import ProtectedRoute from "./features/auth/component/ProtectedRoute";
import RoleGuard from "./features/auth/component/RoleGuard";
import ToastProvider from "./components/common/ToastProvider";
import ErrorBoundary from "./components/common/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected Routes & Dashboard Layout Shell */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              {/* Common protected redirects */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/orders" element={<OrderPage />} />
              <Route path="/pos" element={<OfflinePOSPage />} />
              <Route path="/inventory" element={<InventoryDashboard />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/subscriptions" element={<PlanManagement />} />
              <Route path="/settings" element={<OwnerDashboard />} />
              <Route path="/crm" element={<CustomerDirectory />} />
              <Route path="/audit-logs" element={<AuditLogsPage />} />
              <Route path="/webhooks" element={<WebhookLogsPage />} />

              {/* Super Admin Area */}
              <Route
                path="/super-admin"
                element={
                  <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
                    <SuperAdminDashboard />
                  </RoleGuard>
                }
              />

              {/* Unauthorized Redirect */}
              <Route
                path="/unauthorized"
                element={
                  <div
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "var(--red)",
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    Unauthorized Access. You do not have permission to view this
                    page.
                  </div>
                }
              />
            </Route>
          </Route>

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
