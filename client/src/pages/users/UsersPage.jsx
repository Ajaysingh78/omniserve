import { useState, useEffect } from 'react';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import useAuth from '../../hooks/useAuth';
import { HiPlus } from 'react-icons/hi2';
import { listRestaurantsApi } from '../../api/models/restaurant.api';
import { listOutletsApi } from '../../api/models/outlet.api';
import { listUsersApi, createUserApi, updateUserApi, deleteUserApi } from '../../api/models/user.api';
import { ROLE_LABELS, ROLE_BADGE_VARIANT, USER_STATUS_VARIANT, USER_ROLES } from '../../utils/constants';
import { getEntityId, getList, getRefId } from '../../utils/apiData';

const ASSIGNABLE_ROLES = {
  [USER_ROLES.SUPER_ADMIN]: [USER_ROLES.RESTAURANT_OWNER, USER_ROLES.OUTLET_MANAGER, USER_ROLES.STAFF],
  [USER_ROLES.RESTAURANT_OWNER]: [USER_ROLES.OUTLET_MANAGER, USER_ROLES.STAFF],
};

const restaurantScopedRoles = [USER_ROLES.RESTAURANT_OWNER];
const outletScopedRoles = [USER_ROLES.OUTLET_MANAGER, USER_ROLES.STAFF];

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: USER_ROLES.STAFF,
  restaurantId: '',
  outletId: '',
};

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [data, setData] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: 'create', item: null });
  const [form, setForm] = useState(emptyForm);
  const { addToast } = useToast();

  const myRole = currentUser?.role;
  const allowedRoles = ASSIGNABLE_ROLES[myRole] || [];
  const isSuperAdmin = myRole === USER_ROLES.SUPER_ADMIN;
  const pageTitle = isSuperAdmin ? 'Users' : 'Team';

  const restaurantName = (restaurantId) => {
    const id = getRefId(restaurantId);
    return id ? restaurants.find((restaurant) => getEntityId(restaurant) === id)?.name || 'Unknown' : '-';
  };

  const outletName = (outletId) => {
    const id = getRefId(outletId);
    return id ? outlets.find((outlet) => getEntityId(outlet) === id)?.name || 'Unknown' : '-';
  };

  const outletsForRestaurant = (restaurantId) => outlets.filter((outlet) => getRefId(outlet.restaurantId) === restaurantId);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersResponse, restaurantsResponse, outletsResponse] = await Promise.all([
        listUsersApi(),
        listRestaurantsApi(),
        listOutletsApi(),
      ]);
      setData(getList(usersResponse, 'users'));
      setRestaurants(getList(restaurantsResponse, 'restaurants'));
      setOutlets(getList(outletsResponse, 'outlets'));
    } catch {
      addToast('Failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const defaultRole = () => allowedRoles.includes(USER_ROLES.STAFF) ? USER_ROLES.STAFF : allowedRoles[0] || USER_ROLES.STAFF;

  const defaultRestaurantId = () => currentUser?.restaurantId || getEntityId(restaurants[0]);

  const defaultOutletId = (restaurantId) => currentUser?.outletId || getEntityId(outletsForRestaurant(restaurantId)[0]);

  const openCreate = () => {
    const role = defaultRole();
    const restaurantId = restaurantScopedRoles.includes(role) || outletScopedRoles.includes(role) ? defaultRestaurantId() : '';
    const outletId = outletScopedRoles.includes(role) ? defaultOutletId(restaurantId) : '';
    setForm({ ...emptyForm, role, restaurantId, outletId });
    setModal({ open: true, mode: 'create', item: null });
  };

  const openEdit = (item) => {
    setForm({
      firstName: item.firstName || '',
      lastName: item.lastName || '',
      email: item.email || '',
      password: '',
      role: item.pendingRole || item.role || USER_ROLES.STAFF,
      restaurantId: getRefId(item.pendingRestaurantId || item.restaurantId),
      outletId: getRefId(item.pendingOutletId || item.outletId),
    });
    setModal({ open: true, mode: 'edit', item });
  };

  const closeModal = () => setModal({ open: false, mode: 'create', item: null });

  const updateRole = (role) => {
    const restaurantId = restaurantScopedRoles.includes(role) || outletScopedRoles.includes(role) ? (form.restaurantId || defaultRestaurantId()) : '';
    const outletId = outletScopedRoles.includes(role) ? (form.outletId || defaultOutletId(restaurantId)) : '';
    setForm({ ...form, role, restaurantId, outletId });
  };

  const updateRestaurant = (restaurantId) => {
    setForm({
      ...form,
      restaurantId,
      outletId: outletScopedRoles.includes(form.role) ? defaultOutletId(restaurantId) : '',
    });
  };

  const buildPayload = () => {
    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      role: form.role,
      restaurantId: form.restaurantId || undefined,
      outletId: form.outletId || undefined,
    };
    if (modal.mode === 'create') payload.password = form.password;
    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = buildPayload();
      if (modal.mode === 'create') {
        await createUserApi(payload);
        addToast('Invitation sent', 'success');
      } else {
        await updateUserApi(getEntityId(modal.item), payload);
        addToast('User updated', 'success');
      }
      closeModal();
      fetchData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed', 'error');
    }
  };

  const handleDelete = async (row) => {
    if (!confirm('Delete this user?')) return;
    try {
      await deleteUserApi(getEntityId(row));
      addToast('Deleted', 'success');
      fetchData();
    } catch {
      addToast('Failed', 'error');
    }
  };

  const visibleData = isSuperAdmin ? data : data.filter((u) => allowedRoles.includes(u.pendingRole || u.role));
  const filteredOutlets = outletsForRestaurant(form.restaurantId);
  const needsRestaurant = restaurantScopedRoles.includes(form.role) || outletScopedRoles.includes(form.role);
  const needsOutlet = outletScopedRoles.includes(form.role);

  const columns = [
    { key: 'name', label: 'Name', render: (r) => `${r.firstName || ''} ${r.lastName || ''}`.trim() || '-' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (r) => <Badge variant={ROLE_BADGE_VARIANT[r.pendingRole || r.role] || 'neutral'}>{ROLE_LABELS[r.pendingRole || r.role] || r.pendingRole || r.role}</Badge> },
    { key: 'restaurantId', label: 'Restaurant', render: (r) => restaurantName(r.pendingRestaurantId || r.restaurantId) },
    { key: 'outletId', label: 'Outlet', render: (r) => outletName(r.pendingOutletId || r.outletId) },
    { key: 'status', label: 'Status', render: (r) => <Badge variant={r.invitationAccepted === false ? 'warning' : USER_STATUS_VARIANT[r.status] || 'neutral'}>{r.invitationAccepted === false ? 'Pending Invite' : r.status}</Badge> },
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => openEdit(r)}>Edit</Button>
        <Button size="sm" variant="danger" onClick={() => handleDelete(r)}>Delete</Button>
      </div>
    ) },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-xl font-bold text-slate-100">{pageTitle}</h1>
        <Button onClick={openCreate} disabled={!allowedRoles.length}><HiPlus /> Invite {isSuperAdmin ? 'User' : 'Team Member'}</Button>
      </div>

      <Table columns={columns} data={visibleData} loading={loading} />

      <Modal isOpen={modal.open} onClose={closeModal} title={modal.mode === 'create' ? `Invite ${isSuperAdmin ? 'User' : 'Team Member'}` : 'Edit User'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input id="u-first" label="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
            <Input id="u-last" label="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
          </div>
          <Input id="u-email" label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          {modal.mode === 'create' && <Input id="u-pass" label="Temporary Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />}
          <Select id="u-role" label="Role" value={form.role} onChange={(e) => updateRole(e.target.value)} required>
            {allowedRoles.map((role) => <option key={role} value={role}>{ROLE_LABELS[role]}</option>)}
          </Select>
          {needsRestaurant && (
            <Select id="u-restaurant" label="Restaurant" value={form.restaurantId} onChange={(e) => updateRestaurant(e.target.value)} required>
              <option value="" disabled>Select restaurant</option>
              {restaurants.map((restaurant) => <option key={getEntityId(restaurant)} value={getEntityId(restaurant)}>{restaurant.name}</option>)}
            </Select>
          )}
          {needsOutlet && (
            <Select id="u-outlet" label="Outlet" value={form.outletId} onChange={(e) => setForm({ ...form, outletId: e.target.value })} required>
              <option value="" disabled>Select outlet</option>
              {filteredOutlets.map((outlet) => <option key={getEntityId(outlet)} value={getEntityId(outlet)}>{outlet.name}</option>)}
            </Select>
          )}
          <div className="flex justify-end gap-2 pt-4 border-t border-[rgba(99,102,241,0.15)]">
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit">{modal.mode === 'create' ? 'Send Invite' : 'Save'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
