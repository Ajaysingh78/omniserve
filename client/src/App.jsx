import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { USER_ROLES } from './utils/constants';
import { fetchCurrentUser } from './store/authSlice';
import Spinner from './components/ui/Spinner';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './layouts/ProtectedRoute';
import AuthRoute from './layouts/authRoute';

const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const RestaurantsPage = lazy(() => import('./pages/restaurants/RestaurantsPage'));
const OutletsPage = lazy(() => import('./pages/outlets/OutletsPage'));
const CategoriesPage = lazy(() => import('./pages/menu/CategoriesPage'));
const MenuItemsPage = lazy(() => import('./pages/menu/MenuItemsPage'));
const VariantsPage = lazy(() => import('./pages/menu/VariantsPage'));
const AddonsPage = lazy(() => import('./pages/menu/AddonsPage'));
const OrdersPage = lazy(() => import('./pages/orders/OrdersPage'));
const CustomersPage = lazy(() => import('./pages/customers/CustomersPage'));
const InventoryPage = lazy(() => import('./pages/inventory/InventoryPage'));
const SubscriptionsPage = lazy(() => import('./pages/subscriptions/SubscriptionsPage'));
const PaymentsPage = lazy(() => import('./pages/payments/PaymentsPage'));
const AnalyticsPage = lazy(() => import('./pages/analytics/AnalyticsPage'));
const NotificationsPage = lazy(() => import('./pages/notifications/NotificationsPage'));
const AuditLogsPage = lazy(() => import('./pages/audit/AuditLogsPage'));
const WebhookLogs = lazy(() => import('./pages/audit/WebhookLogs'));
const UsersPage = lazy(() => import('./pages/users/UsersPage'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));

const { SUPER_ADMIN, RESTAURANT_OWNER, OUTLET_MANAGER, STAFF } = USER_ROLES;

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="md" />
    </div>
  );
}

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              <Route element={<ProtectedRoute roles={[SUPER_ADMIN]} />}>
                <Route path="/restaurants" element={<RestaurantsPage />} />
                <Route path="/audit-logs" element={<AuditLogsPage />} />
                <Route path="/webhook-logs" element={<WebhookLogs />} />
                <Route path="/subscriptions" element={<SubscriptionsPage />} />
              </Route>

              <Route element={<ProtectedRoute roles={[SUPER_ADMIN, RESTAURANT_OWNER]} />}>
                <Route path="/users" element={<UsersPage />} />
                <Route path="/outlets" element={<OutletsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/payments" element={<PaymentsPage />} />
              </Route>

              <Route element={<ProtectedRoute roles={[SUPER_ADMIN, RESTAURANT_OWNER, OUTLET_MANAGER]} />}>
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/menu-items" element={<MenuItemsPage />} />
                <Route path="/variants" element={<VariantsPage />} />
                <Route path="/addons" element={<AddonsPage />} />
                <Route path="/customers" element={<CustomersPage />} />
              </Route>

              <Route element={<ProtectedRoute roles={[SUPER_ADMIN, RESTAURANT_OWNER, OUTLET_MANAGER, STAFF]} />}>
                <Route path="/inventory" element={<InventoryPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
