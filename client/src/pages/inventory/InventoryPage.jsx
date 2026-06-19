import { useState, useEffect } from 'react';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import useAuth from '../../hooks/useAuth';
import { HiPlus } from 'react-icons/hi2';
import { listInventoryApi, createInventoryApi, updateInventoryQuantityApi } from '../../api/models/inventory.api';
import { USER_ROLES } from '../../utils/constants';
import { getEntityId, getList } from '../../utils/apiData';

const canCreateInventory = (role) => [
  USER_ROLES.SUPER_ADMIN,
  USER_ROLES.RESTAURANT_OWNER,
  USER_ROLES.OUTLET_MANAGER,
].includes(role);

export default function InventoryPage() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: 'quantity', item: null });
  const [form, setForm] = useState({ outletId: '', menuItemId: '', quantity: '', threshold: '' });
  const { addToast } = useToast();

  const mayCreate = canCreateInventory(user?.role);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await listInventoryApi();
      setData(getList(response, 'inventory'));
    } catch {
      addToast('Failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setForm({ outletId: user?.outletId || '', menuItemId: '', quantity: '', threshold: '' });
    setModal({ open: true, mode: 'create', item: null });
  };

  const openQuantity = (item) => {
    setForm({ outletId: '', menuItemId: '', quantity: item.quantity ?? '', threshold: '' });
    setModal({ open: true, mode: 'quantity', item });
  };

  const closeModal = () => setModal({ open: false, mode: 'quantity', item: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal.mode === 'create') {
        await createInventoryApi({
          outletId: form.outletId,
          menuItemId: form.menuItemId,
          quantity: Number(form.quantity),
          threshold: Number(form.threshold) || 10,
        });
        addToast('Created', 'success');
      } else {
        await updateInventoryQuantityApi(getEntityId(modal.item), Number(form.quantity));
        addToast('Quantity updated', 'success');
      }
      closeModal();
      fetchData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed', 'error');
    }
  };

  const columns = [
    { key: 'menuItemId', label: 'Item', render: (r) => r.menuItemId?.name || r.name || r.itemName || getEntityId(r.menuItemId) || '-' },
    { key: 'outletId', label: 'Outlet', render: (r) => r.outletId?.name || getEntityId(r.outletId) || '-' },
    { key: 'quantity', label: 'Qty', render: (r) => <Badge variant={r.isLowStock || r.quantity <= (r.threshold || r.lowStockThreshold || 10) ? 'danger' : 'success'}>{r.quantity}</Badge> },
    { key: 'threshold', label: 'Threshold', render: (r) => r.threshold || r.lowStockThreshold || 10 },
    { key: 'updatedAt', label: 'Updated', render: (r) => r.updatedAt || r.createdAt ? new Date(r.updatedAt || r.createdAt).toLocaleDateString() : '-' },
    { key: 'actions', label: 'Actions', render: (r) => <Button size="sm" variant="secondary" onClick={() => openQuantity(r)}>Update Qty</Button> },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-xl font-bold text-slate-100">Inventory</h1>
        {mayCreate && <Button onClick={openCreate}><HiPlus /> Add Item</Button>}
      </div>
      <Table columns={columns} data={data} loading={loading} />
      <Modal isOpen={modal.open} onClose={closeModal} title={modal.mode === 'create' ? 'New Inventory Record' : 'Update Quantity'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {modal.mode === 'create' && (
            <>
              <Input id="inv-outlet" label="Outlet ID" value={form.outletId} onChange={(e) => setForm({ ...form, outletId: e.target.value })} required />
              <Input id="inv-menu-item" label="Menu Item ID" value={form.menuItemId} onChange={(e) => setForm({ ...form, menuItemId: e.target.value })} required />
            </>
          )}
          <Input id="inv-qty" label="Quantity" type="number" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
          {modal.mode === 'create' && <Input id="inv-threshold" label="Low Stock Threshold" type="number" min="0" value={form.threshold} onChange={(e) => setForm({ ...form, threshold: e.target.value })} />}
          <div className="flex justify-end gap-2 pt-4 border-t border-[rgba(99,102,241,0.15)]">
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit">{modal.mode === 'create' ? 'Create' : 'Save'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
