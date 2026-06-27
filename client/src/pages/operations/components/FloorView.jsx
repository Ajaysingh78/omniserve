import { useState, useEffect, useCallback } from 'react';
import { getTablesApi, getDiningAreasApi, executeDiningOperationApi, getUnifiedTimelineApi, getSessionBillApi } from '../../../api/models/operations.api';
import { useSocket } from '../../../context/SocketContext';
import { useToast } from '../../../components/ui/Toast';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Spinner from '../../../components/ui/Spinner';
import { HiOutlineUser, HiOutlineXMark, HiOutlinePlus, HiOutlineTrash, HiArrowsRightLeft, HiOutlineArrowRight } from 'react-icons/hi2';

export default function FloorView() {
  const { lastMessage, joinSession, leaveSession } = useSocket();
  const { addToast } = useToast();
  
  const [diningAreas, setDiningAreas] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState('');
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Table Drawer state
  const [selectedTable, setSelectedTable] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tableTimeline, setTableTimeline] = useState([]);
  const [billDetails, setBillDetails] = useState(null);

  // Seat operation modal states
  const [seatModal, setSeatModal] = useState({ open: false, mode: '', data: {} });

  const fetchData = useCallback(async () => {
    try {
      const [areasRes, tablesRes] = await Promise.all([
        getDiningAreasApi(),
        getTablesApi()
      ]);
      const areas = areasRes.data?.data?.areas || [];
      const allTables = tablesRes.data?.data?.tables || [];

      setDiningAreas(areas);
      setTables(allTables);

      if (areas.length > 0 && !selectedAreaId) {
        setSelectedAreaId(areas[0]._id || areas[0].id);
      }
    } catch (err) {
      addToast('Failed to load floor layout', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedAreaId, addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Drawer details lookup
  const loadDrawerDetails = useCallback(async (table) => {
    if (!table.activeSessionId) {
      setTableTimeline([]);
      setBillDetails(null);
      return;
    }

    try {
      joinSession(table.activeSessionId.toString());
      const [timelineRes, billRes] = await Promise.all([
        getUnifiedTimelineApi(table.activeSessionId),
        getSessionBillApi(table.activeSessionId).catch(() => ({ data: { data: null } }))
      ]);

      setTableTimeline(timelineRes.data?.data?.timeline || []);
      setBillDetails(billRes.data?.data || null);
    } catch (err) {
      console.warn('Failed to load table drawer details:', err);
    }
  }, [joinSession]);

  // WebSocket event handler
  useEffect(() => {
    if (!lastMessage) return;
    const { event, payload } = lastMessage;

    // Direct local state patching for lightning fast real-time updates
    const tableEvents = [
      'TABLE_OCCUPIED', 'TABLE_AVAILABLE', 'TABLE_RESERVED', 'TABLE_STATUS_CHANGED',
      'TABLE_TRANSFERRED', 'TABLE_MERGED', 'TABLE_UNMERGED', 'TABLE_CLEANING_STARTED',
      'TABLE_CLEANING_COMPLETED', 'SESSION_CLOSED', 'GUEST_COUNT_CHANGED', 'WAITER_CHANGED',
      'SEAT_ADDED', 'SEAT_REMOVED', 'SEAT_MOVED', 'SEAT_SWAPPED', 'BILL_REQUESTED', 'BILL_SETTLED'
    ];

    if (tableEvents.includes(event)) {
      fetchData().then(() => {
        // If drawer is open, refresh detail views
        if (selectedTable) {
          const updatedTable = tables.find(t => t._id === selectedTable._id || t.id === selectedTable.id);
          if (updatedTable) {
            setSelectedTable(updatedTable);
            loadDrawerDetails(updatedTable);
          }
        }
      });
    }
  }, [lastMessage, tables, selectedTable, fetchData, loadDrawerDetails]);

  // Handle table drawer toggle
  const handleTableClick = (table) => {
    // Leave previous session room
    if (selectedTable?.activeSessionId) {
      leaveSession(selectedTable.activeSessionId.toString());
    }
    setSelectedTable(table);
    setDrawerOpen(true);
    loadDrawerDetails(table);
  };

  const handleCloseDrawer = () => {
    if (selectedTable?.activeSessionId) {
      leaveSession(selectedTable.activeSessionId.toString());
    }
    setDrawerOpen(false);
    setSelectedTable(null);
  };

  // Perform operational commands on backend
  const runOperation = async (operationType, payload) => {
    try {
      await executeDiningOperationApi({
        operationType,
        payload
      });
      addToast(`Operation ${operationType} succeeded`, 'success');
      fetchData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  // Color mapper for table operational statuses
  const getTableColor = (table) => {
    if (table.operationalStatus === 'CLEANING') return 'bg-purple-500 text-white hover:bg-purple-650';
    if (table.operationalStatus === 'BILL_REQUESTED') return 'bg-yellow-500 text-black hover:bg-yellow-600';
    if (table.operationalStatus === 'RESERVED') return 'bg-blue-500 text-white hover:bg-blue-600';
    if (table.activeSessionId) return 'bg-red-500 text-white hover:bg-red-600'; // Occupied
    return 'bg-success-green text-white hover:bg-emerald-600'; // Available
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  const currentAreaTables = tables.filter(t => t.diningAreaId?.toString() === selectedAreaId || t.diningAreaId?._id?.toString() === selectedAreaId);

  return (
    <div className="relative flex flex-col gap-6 animate-fade-in">
      {/* Area selector tabs */}
      <div className="flex gap-2 pb-2 overflow-x-auto">
        {diningAreas.map(area => (
          <button
            key={area._id || area.id}
            onClick={() => setSelectedAreaId(area._id || area.id)}
            className={`px-4 py-2 rounded-lg text-[13px] font-bold cursor-pointer transition-all ${
              selectedAreaId === (area._id || area.id)
                ? 'bg-primary text-white dark:bg-primary-fixed dark:text-zinc-950 shadow-md'
                : 'bg-white text-on-surface-variant border border-border-base hover:bg-surface-container-low dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-900'
            }`}
          >
            {area.name}
          </button>
        ))}
      </div>

      {/* Grid Floor workspace */}
      <div className="relative w-full h-[600px] bg-white dark:bg-zinc-950 border border-border-base dark:border-zinc-900 rounded-xl overflow-hidden shadow-inner">
        {/* Dynamic Canvas grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-70" />

        {currentAreaTables.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center flex-col text-on-surface-variant dark:text-zinc-550">
            <span className="text-[14px] font-semibold">No tables mapped to this dining area.</span>
            <span className="text-[12px] mt-1">Use the Floor Designer tab to place tables.</span>
          </div>
        ) : (
          currentAreaTables.map((table) => {
            const layout = table.layout || { x: 50, y: 50, width: 80, height: 80, rotation: 0, shape: 'square' };
            const isRound = layout.shape === 'round';
            const tableColor = getTableColor(table);

            return (
              <button
                key={table._id || table.id}
                onClick={() => handleTableClick(table)}
                style={{
                  position: 'absolute',
                  left: `${layout.x}px`,
                  top: `${layout.y}px`,
                  width: `${layout.width}px`,
                  height: `${layout.height}px`,
                  transform: `rotate(${layout.rotation || 0}deg)`,
                  zIndex: layout.zIndex || 10,
                  cursor: 'pointer'
                }}
                className={`flex flex-col items-center justify-center shadow-lg font-hanken text-[12px] font-bold border border-black/10 transition-all ${
                  isRound ? 'rounded-full' : 'rounded-lg'
                } ${tableColor}`}
              >
                <span className="text-[13px]">{table.tableNumber}</span>
                <span className="text-[10px] opacity-80 font-normal">Cap: {table.seatCount}</span>
                {table.operationalStatus === 'CLEANING' && <span className="text-[9px] uppercase tracking-wider font-semibold bg-black/20 px-1 rounded mt-1">Cleaning</span>}
                {table.operationalStatus === 'BILL_REQUESTED' && <span className="text-[9px] uppercase tracking-wider font-semibold bg-black/25 px-1 rounded mt-1">Bill</span>}
              </button>
            );
          })
        )}
      </div>

      {/* Table Side Detail Drawer */}
      {drawerOpen && selectedTable && (
        <div className="fixed inset-y-0 right-0 w-[450px] bg-white dark:bg-zinc-950 border-l border-border-base dark:border-zinc-900 shadow-2xl z-[150] flex flex-col animate-slide-in-right">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-border-base dark:border-zinc-900">
            <div>
              <h2 className="text-[16px] font-bold text-on-background">Table {selectedTable.tableNumber}</h2>
              <span className="text-[11px] text-on-surface-variant dark:text-zinc-550 uppercase tracking-widest font-bold">
                {selectedTable.operationalStatus || 'Available'}
              </span>
            </div>
            <button onClick={handleCloseDrawer} className="text-on-surface-variant hover:text-on-background cursor-pointer">
              <HiOutlineXMark className="text-xl" />
            </button>
          </div>

          {/* Drawer Body Scroll */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Quick Actions Panel */}
            <div className="space-y-2">
              <h3 className="text-[12px] font-bold text-on-surface-variant/70 uppercase tracking-wider">Operational Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {!selectedTable.activeSessionId ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-full"
                    onClick={() => runOperation('TRANSFER_TABLE', { fromTableId: selectedTable._id, toTableId: '' })} // example shell
                  >
                    Host Session
                  </Button>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => runOperation('START_CLEANING', { tableId: selectedTable._id })}
                    >
                      Start Cleaning
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      className="w-full"
                      onClick={() => runOperation('REQUEST_BILL', { sessionId: selectedTable.activeSessionId })}
                    >
                      Request Bill
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="col-span-2 w-full text-red-500 border-red-550 hover:bg-red-50 dark:hover:bg-red-950/20"
                      onClick={() => runOperation('CLOSE_SESSION', { sessionId: selectedTable.activeSessionId })}
                    >
                      Close Session
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Session Information */}
            {selectedTable.activeSessionId && billDetails ? (
              <div className="space-y-4">
                <div className="border-t border-border-base dark:border-zinc-900 pt-4">
                  <h3 className="text-[12px] font-bold text-on-surface-variant/70 uppercase tracking-wider mb-2">Live Session Details</h3>
                  <div className="bg-surface-container-low dark:bg-zinc-900/40 p-4 rounded-lg space-y-2.5 text-[13px]">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant dark:text-zinc-400">Split Mode:</span>
                      <span className="font-bold uppercase">{billDetails.billSession?.splitType || 'None'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant dark:text-zinc-400">Total Bill Amount:</span>
                      <span className="font-bold text-primary dark:text-primary-fixed-dim">
                        ${billDetails.billSession?.totalAmount?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant dark:text-zinc-400">Outstanding:</span>
                      <span className="font-bold text-red-500">
                        ${billDetails.billSession?.outstandingBalance?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Seat management display inside drawer */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[12px] font-bold text-on-surface-variant/70 uppercase tracking-wider">Seats Occupied</h3>
                    <button 
                      onClick={() => setSeatModal({ open: true, mode: 'add', data: { sessionId: selectedTable.activeSessionId } })}
                      className="text-primary text-[12px] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <HiOutlinePlus /> Add Seat
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {billDetails.orders?.map((order, index) => (
                      <div key={order._id || order.id} className="border border-border-base dark:border-zinc-900 p-3 rounded-lg flex flex-col justify-between bg-white dark:bg-zinc-950">
                        <div className="flex items-center gap-2 mb-1.5">
                          <HiOutlineUser className="text-on-surface-variant" />
                          <span className="font-bold text-[12px]">Seat {order.diningContext?.seatNumber || (index + 1)}</span>
                        </div>
                        <span className="text-[11px] text-on-surface-variant dark:text-zinc-550 mb-2 truncate">
                          Order: #{order.orderNumber || ''}
                        </span>
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-bold">${order.totalAmount?.toFixed(2)}</span>
                          <button 
                            onClick={() => runOperation('REMOVE_SEAT', { sessionId: selectedTable.activeSessionId, seatNumber: order.diningContext?.seatNumber })}
                            className="text-red-500 text-xs hover:text-red-650 shrink-0 cursor-pointer"
                          >
                            <HiOutlineTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Table Chronological Activity Feed */}
                <div className="space-y-3">
                  <h3 className="text-[12px] font-bold text-on-surface-variant/70 uppercase tracking-wider">Live Table Timeline</h3>
                  <div className="relative border-l border-border-base dark:border-zinc-800 pl-4 space-y-4 ml-1">
                    {tableTimeline.slice(-5).reverse().map((event, idx) => (
                      <div key={idx} className="relative text-[12px]">
                        <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-primary dark:bg-primary-fixed-dim" />
                        <span className="text-on-surface-variant dark:text-zinc-500 text-[10px] block">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="font-bold text-on-background block">{event.status}</span>
                        <p className="text-on-surface-variant dark:text-zinc-400 text-[11px] mt-0.5">{event.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant dark:text-zinc-550 border border-dashed border-border-base dark:border-zinc-800 rounded-xl">
                <span>No active session.</span>
                <span className="text-[11px] mt-0.5">Table is currently empty and available.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Seat Operation Modal */}
      {seatModal.open && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-border-base dark:border-zinc-900 w-[350px] space-y-4 shadow-2xl">
            <h3 className="text-[15px] font-bold text-on-background">Add Seat to Session</h3>
            <div className="space-y-3">
              <label className="text-[12px] font-bold text-on-surface-variant dark:text-zinc-400">Seat Designation (e.g. Seat 5)</label>
              <input
                type="text"
                placeholder="Seat Number"
                id="seatNumberInput"
                className="w-full bg-surface-container dark:bg-zinc-900 border border-border-base dark:border-zinc-800 rounded-lg p-2 text-sm text-on-background"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setSeatModal({ open: false, mode: '', data: {} })}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={() => {
                const seatNum = document.getElementById('seatNumberInput')?.value;
                if (seatNum) {
                  runOperation('ADD_SEAT', { sessionId: seatModal.data.sessionId, seatNumber: seatNum });
                  setSeatModal({ open: false, mode: '', data: {} });
                }
              }}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
