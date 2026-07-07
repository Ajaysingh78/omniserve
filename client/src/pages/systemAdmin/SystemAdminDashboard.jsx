import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineUserPlus, 
  HiOutlineBuildingStorefront, 
  HiOutlineHeart, 
  HiOutlineClock, 
  HiOutlineTrash, 
  HiOutlineShieldCheck 
} from 'react-icons/hi2';
import StatCard from '../../components/StatCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import { sendInviteApi, getInvitesApi, revokeInviteApi, getHealthDiagnosticsApi, listTenantsApi } from '../../api/models/systemAdmin.api';

export default function SystemAdminDashboard() {
  const navigate = useNavigate();
  const [invites, setInvites] = useState([]);
  const [healthSummary, setHealthSummary] = useState(null);
  const [totalTenants, setTotalTenants] = useState(0);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  
  // Loading & UI state
  const [loadingInvites, setLoadingInvites] = useState(true);
  const [submittingInvite, setSubmittingInvite] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchDashboardData = () => {
    // 1. Fetch invites
    getInvitesApi()
      .then((res) => setInvites(res.data?.data || []))
      .catch(() => {})
      .finally(() => setLoadingInvites(false));

    // 2. Fetch shallow health
    getHealthDiagnosticsApi()
      .then((res) => setHealthSummary(res.data?.data))
      .catch(() => {});

    // 3. Fetch tenants count
    listTenantsApi({ limit: 1 })
      .then((res) => setTotalTenants(res.data?.data?.total || 0))
      .catch(() => {});
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;

    setSubmittingInvite(true);
    setErrorMsg('');
    setSuccessMsg('');

    sendInviteApi(inviteEmail, inviteName)
      .then(() => {
        setSuccessMsg(`Invitation successfully sent to ${inviteEmail}`);
        setInviteEmail('');
        setInviteName('');
        // Rerender invites
        getInvitesApi().then((res) => setInvites(res.data?.data || []));
      })
      .catch((err) => {
        setErrorMsg(err.response?.data?.message || 'Failed to send invitation');
      })
      .finally(() => {
        setSubmittingInvite(false);
      });
  };

  const handleRevokeInvite = (id) => {
    if (!window.confirm('Are you sure you want to revoke this invitation?')) return;
    
    revokeInviteApi(id)
      .then(() => {
        setInvites(invites.map(inv => inv._id === id ? { ...inv, status: 'REVOKED' } : inv));
      })
      .catch((err) => {
        alert(err.response?.data?.message || 'Failed to revoke invite');
      });
  };

  const activeInvitesCount = invites.filter(i => i.status === 'PENDING').length;

  const columns = [
    { key: 'email', label: 'Email Address', render: (r) => <span className="font-semibold">{r.email}</span> },
    { key: 'name', label: 'Name', render: (r) => r.name },
    { 
      key: 'invitedBy', 
      label: 'Invited By', 
      render: (r) => r.invitedBy ? `${r.invitedBy.firstName || ''} ${r.invitedBy.lastName || ''} (${r.invitedBy.email})` : 'System' 
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (r) => {
        let variant = 'neutral';
        if (r.status === 'PENDING') variant = 'warning';
        if (r.status === 'ACCEPTED') variant = 'success';
        if (r.status === 'REVOKED') variant = 'error';
        if (r.status === 'EXPIRED') variant = 'neutral';
        return <Badge variant={variant}>{r.status}</Badge>;
      } 
    },
    { key: 'expiresAt', label: 'Expires', render: (r) => new Date(r.expiresAt).toLocaleDateString() },
    { 
      key: 'actions', 
      label: 'Actions', 
      render: (r) => r.status === 'PENDING' && (
        <button 
          onClick={() => handleRevokeInvite(r._id)} 
          className="text-xs text-error font-bold flex items-center gap-1 hover:underline cursor-pointer"
        >
          <HiOutlineTrash /> Revoke
        </button>
      ) 
    }
  ];

  // Map health state to colors
  const healthStatus = healthSummary?.status || 'checking';
  let healthColor = 'amber';
  if (healthStatus === 'ok') healthColor = 'emerald';
  if (healthStatus === 'down') healthColor = 'rose';

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-headline-lg font-headline-lg text-on-surface dark:text-zinc-100 text-[24px] font-bold tracking-tight">
            System Administrator Cockpit
          </h2>
          <p className="text-body-md text-on-surface-variant dark:text-zinc-400 text-[14px]">
            Platform overall operations, tenant states, and system health status.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/system-admin/tenants')} variant="outline" size="sm">
            <HiOutlineBuildingStorefront className="text-lg" /> Manage Tenants
          </Button>
          <Button onClick={() => navigate('/system-admin/diagnostics')} variant="primary" size="sm">
            <HiOutlineShieldCheck className="text-lg" /> Health Checks
          </Button>
        </div>
      </div>

      {/* Cards block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="System Health" 
          value={healthStatus.toUpperCase()} 
          icon={<HiOutlineHeart className="text-[20px]" />} 
          color={healthColor} 
        />
        <StatCard 
          title="Total Tenants" 
          value={totalTenants.toString()} 
          icon={<HiOutlineBuildingStorefront className="text-[20px]" />} 
          color="indigo" 
        />
        <StatCard 
          title="Active Invites" 
          value={activeInvitesCount.toString()} 
          icon={<HiOutlineUserPlus className="text-[20px]" />} 
          color="amber" 
        />
        <StatCard 
          title="Platform Uptime" 
          value={healthSummary?.uptime ? `${Math.floor(healthSummary.uptime / 3600)}h ${Math.floor((healthSummary.uptime % 3600) / 60)}m` : 'Checking...'} 
          icon={<HiOutlineClock className="text-[20px]" />} 
          color="blue" 
        />
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Admin invitations list */}
        <Card className="lg:col-span-8 flex flex-col gap-4">
          <h3 className="text-headline-sm font-headline-sm text-on-surface dark:text-zinc-100 text-[16px] font-bold">
            Platform Admin Invites
          </h3>
          <Table columns={columns} data={invites} loading={loadingInvites} emptyMessage="No invitations created yet" />
        </Card>

        {/* Right column: Invite form & diagnostics shortcuts */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Invite form */}
          <Card className="flex flex-col gap-4">
            <h3 className="text-headline-sm font-headline-sm text-on-surface dark:text-zinc-100 text-[16px] font-bold">
              Invite Platform Administrator
            </h3>
            
            {successMsg && (
              <div className="alert alert-success text-xs py-2 shadow-xs rounded-lg">
                <span>{successMsg}</span>
              </div>
            )}
            {errorMsg && (
              <div className="alert alert-error text-xs py-2 shadow-xs rounded-lg">
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSendInvite} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="e.g. John Doe"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                required
                disabled={submittingInvite}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="e.g. admin@platform.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                disabled={submittingInvite}
              />
              <Button 
                type="submit" 
                variant="primary" 
                className="w-full mt-2" 
                loading={submittingInvite}
                disabled={!inviteEmail || !inviteName}
              >
                Send Invite Link
              </Button>
            </form>
          </Card>

          {/* Quick System Check Widget */}
          <Card className="flex flex-col gap-3">
            <h3 className="text-headline-sm font-headline-sm text-on-surface dark:text-zinc-100 text-[15px] font-bold">
              Infrastructure Status
            </h3>
            <div className="space-y-2 mt-1">
              <div className="flex justify-between items-center text-xs py-1">
                <span>MongoDB Connection</span>
                <span className={`font-semibold ${healthSummary?.checks?.infra?.mongodb?.status === 'ok' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {healthSummary?.checks?.infra?.mongodb?.status === 'ok' ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs py-1 border-t border-border-base dark:border-zinc-900">
                <span>Redis Client</span>
                <span className={`font-semibold ${healthSummary?.checks?.infra?.redis?.status === 'ok' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {healthSummary?.checks?.infra?.redis?.status === 'ok' ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs py-1 border-t border-border-base dark:border-zinc-900">
                <span>Stripe & Razorpay API</span>
                <span className={`font-semibold ${healthSummary?.checks?.infra?.paymentGateway?.status === 'ok' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {healthSummary?.checks?.infra?.paymentGateway?.status === 'ok' ? 'Reachable' : 'Degraded'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs py-1 border-t border-border-base dark:border-zinc-900">
                <span>Available Disk Space</span>
                <span className="font-semibold text-zinc-500 dark:text-zinc-400">
                  {healthSummary?.checks?.infra?.diskSpace?.details || 'Unknown'}
                </span>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/system-admin/diagnostics')} 
              variant="outline" 
              className="btn-sm w-full mt-2"
            >
              Detailed Diagnostics
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
