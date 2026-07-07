import useAuth from '../../hooks/useAuth';
import { USER_ROLES } from '../../utils/constants';
import SuperAdminDashboard from './SuperAdminDashboard';
import OwnerDashboard from './OwnerDashboard';
import ManagerDashboard from './ManagerDashboard';
import StaffDashboard from './StaffDashboard';
import SystemAdminDashboard from '../systemAdmin/SystemAdminDashboard';

export default function DashboardPage() {
  const { user } = useAuth();

  switch (user?.role) {
    case USER_ROLES.SYSTEM_ADMIN:
      return <SystemAdminDashboard />;
    case USER_ROLES.SUPER_ADMIN:
      return <SuperAdminDashboard />;
    case USER_ROLES.RESTAURANT_OWNER:
      return <OwnerDashboard />;
    case USER_ROLES.OUTLET_MANAGER:
      return <ManagerDashboard />;
    case USER_ROLES.STAFF:
      return <StaffDashboard />;
    default:
      return <OwnerDashboard />;
  }
}
