import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  DollarSign, ShoppingBag, Users,
  Activity, TrendingUp, Package
} from "lucide-react";
import { COL_META, KITCHEN_LOAD, AI_RECS, STAFF, INVENTORY_RISK } from "../../../data/data";
import StatsCards from "./StateCard";
import axiosInstance from "@/services/axios";
import toast from "react-hot-toast";

// ─── ICON PRIMITIVES ─────────────────────────────────────────────────────────
const IClose    = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IFilter   = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const IRefresh  = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;

const Badge = ({ children, variant = "gray" }) => (
  <span className={`badge badge-${variant}`}>{children}</span>
);

const CH_COLORS = {
  DINE_IN: "blue",
  TAKEAWAY: "green",
  DELIVERY: "purple",
  ONLINE: "amber",
};

function OrderCard({ order, onSelect, onUpdateStatus, onCancel }) {
  const slaColor = order.sla > 70 ? "var(--green)" : order.sla > 40 ? "var(--amber)" : "var(--red)";
  const chVariant = CH_COLORS[order.ch] || "gray";

  return (
    <div
      className={`order-card priority-${order.pr}`}
      onClick={() => onSelect(order)}
    >
      <div className="oc-top">
        <span className="oc-id">{order.id}</span>
        <span className="oc-time">{order.mins}m ago</span>
      </div>
      <div className="oc-customer">{order.name}</div>
      <div className="oc-meta">
        <Badge variant={chVariant}>{order.ch}</Badge>
        <Badge variant="gray">{order.delivery}</Badge>
        {order.pr === "high" && <Badge variant="red">Urgent</Badge>}
      </div>
      <div className="oc-value">₹{order.val.toLocaleString()}</div>
      <div className="sla-bar">
        <div className="sla-fill" style={{ width: `${order.sla}%`, background: slaColor }} />
      </div>
      {order.col === "new" && (
        <div className="oc-actions" onClick={(e) => e.stopPropagation()}>
          <button className="oc-btn accept" onClick={() => onUpdateStatus(order.realId, "ACCEPTED")}>Accept</button>
          <button className="oc-btn reject" onClick={() => onCancel(order.realId)}>Reject</button>
        </div>
      )}
    </div>
  );
}

function CommandCenter({ orders, onSelect, onUpdateStatus, onCancel, onRefresh }) {
  return (
    <div className="command-center">
      <div className="cc-header">
        <div>
          <div className="cc-title">Live Orders Command Center</div>
          <div className="cc-subtitle">Real-time across all channels · Auto-refresh every 15s</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn"><IFilter /> Filter</button>
          <button className="btn primary" onClick={onRefresh}><IRefresh /> Refresh</button>
        </div>
      </div>

      <div className="cc-cols">
        {COL_META.map((col) => (
          <div key={col.key} className="cc-col">
            <div className="cc-col-header">
              <span className="cc-col-name" style={{ color: col.color }}>{col.label}</span>
              <span className="cc-count">{orders[col.key]?.length || 0}</span>
            </div>
            <div className="cc-cards">
              {orders[col.key]?.length ? (
                orders[col.key].map((o, i) => (
                  <OrderCard 
                    key={o.id + i} 
                    order={o} 
                    onSelect={onSelect} 
                    onUpdateStatus={onUpdateStatus}
                    onCancel={onCancel}
                  />
                ))
              ) : (
                <div className="empty-col">
                  <span style={{ fontSize: 20 }}>—</span>
                  <span>No orders</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IntelPanel() {
  return (
    <div className="intel-panel">
      <div className="intel-header">
        <div className="section-title">Operational Intelligence</div>
        <div className="section-sub">AI-powered real-time insights</div>
      </div>

      <div className="intel-sections">
        {/* Kitchen Load */}
        <div className="intel-block">
          <div className="ib-title">Kitchen Load</div>
          {KITCHEN_LOAD.map(({ name, pct, color }) => (
            <div key={name}>
              <div className="load-label">
                <span>{name}</span>
                <span style={{ color }}>{pct}%</span>
              </div>
              <div className="load-bar">
                <div className="load-fill" style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>

        {/* AI Recommendations */}
        <div className="intel-block">
          <div className="ib-title">AI Recommendations</div>
          {AI_RECS.map((r, i) => (
            <div key={i} className="ai-rec">
              <div className={`ai-icon ${r.type}`}>{r.icon}</div>
              <div className="ai-text">{r.text}</div>
            </div>
          ))}
        </div>

        {/* Staff Utilization */}
        <div className="intel-block">
          <div className="ib-title">Staff Utilization</div>
          {STAFF.map(({ name, role, util, color }) => (
            <div key={name} className="staff-row">
              <div className="staff-avatar">{name[0]}</div>
              <div className="staff-info">
                <div className="staff-name">{name}</div>
                <div className="staff-role">{role}</div>
              </div>
              <div className="staff-util" style={{ color }}>{util}</div>
            </div>
          ))}
        </div>

        {/* Inventory Risk */}
        <div className="intel-block">
          <div className="ib-title">Inventory Risk</div>
          {INVENTORY_RISK.map(({ item, pct, color }) => (
            <div key={item}>
              <div className="load-label">
                <span>{item}</span>
                <span style={{ color }}>{pct}%</span>
              </div>
              <div className="load-bar">
                <div className="load-fill" style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrderDrawer({ order, onClose, onRefresh }) {
  const [updating, setUpdating] = useState(false);
  if (!order) return null;

  const handleUpdateStatus = async (nextStatus) => {
    setUpdating(true);
    const loadingToast = toast.loading(`Updating order status to ${nextStatus}...`);
    try {
      await axiosInstance.patch(`/orders/${order.realId}/status`, {
        orderStatus: nextStatus,
      });
      toast.dismiss(loadingToast);
      toast.success(`Order status updated to ${nextStatus}!`);
      if (onRefresh) onRefresh();
      onClose();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    const reason = prompt("Enter reason for order cancellation:", "Rejected by kitchen");
    if (!reason) return;

    setUpdating(true);
    const loadingToast = toast.loading("Cancelling order...");
    try {
      await axiosInstance.patch(`/orders/${order.realId}/cancel`, {
        cancellationReason: reason,
      });
      toast.dismiss(loadingToast);
      toast.success("Order cancelled successfully!");
      if (onRefresh) onRefresh();
      onClose();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to cancel order");
    } finally {
      setUpdating(false);
    }
  };

  const timeline = [
    { color: "var(--green)", time: `${order.mins}m ago`, text: `Placed via ${order.ch}` },
  ];

  return (
    <div className="drawer-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="drawer">
        {/* Header */}
        <div className="drawer-header">
          <div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 2 }}>{order.id}</div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{order.name}</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Badge variant={order.paid ? "green" : "amber"}>{order.paid ? "Paid" : "Pending"}</Badge>
            <button className="icon-btn" onClick={onClose}><IClose /></button>
          </div>
        </div>

        {/* Customer Info */}
        <div className="drawer-section">
          <div className="ds-title">Customer Info</div>
          {[
            ["Name", order.name],
            ["Channel", order.ch],
            ["Order Type", order.delivery],
            ["Priority", order.pr.toUpperCase()],
            ["Time", `${order.mins} minutes ago`],
          ].map(([l, v]) => (
            <div key={l} className="ds-row">
              <span className="ds-label">{l}</span>
              <span className="ds-value">{v}</span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="drawer-section">
          <div className="ds-title">Order Timeline</div>
          {timeline.map((t, i) => (
            <div key={i} className="timeline-item">
              <div className="tl-dot" style={{ background: t.color }} />
              <span className="tl-time">{t.time}</span>
              <span className="tl-text">{t.text}</span>
            </div>
          ))}
        </div>

        {/* Items */}
        <div className="drawer-section">
          <div className="ds-title">Items Ordered</div>
          {order.items?.map((item, i) => (
            <div key={i} className="item-row">
              <div>
                <div className="item-name">{item.name}</div>
                <div className="item-qty">Qty: {item.quantity}</div>
              </div>
              <div className="item-price">₹{item.unitPrice}</div>
            </div>
          )) || <div style={{ color: "var(--text3)", fontSize: 12 }}>Items list not loaded.</div>}
          <div className="item-total">
            <span>Total</span>
            <span>₹{order.val.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment */}
        <div className="drawer-section">
          <div className="ds-title">Payment Details</div>
          {[
            ["Method", order.original?.payment?.paymentMethod || "COD"],
            ["Status", order.paid ? "PAID" : "PENDING"],
            ["Transaction ID", order.original?.payment?.transactionId || "N/A"],
            ["Amount", `₹${order.val.toLocaleString()}`],
          ].map(([l, v]) => (
            <div key={l} className="ds-row">
              <span className="ds-label">{l}</span>
              <span className="ds-value" style={{ color: l === "Status" && order.paid ? "var(--green)" : undefined }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="drawer-section">
          <div className="ds-title">Actions</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {order.col === "new" && (
              <>
                <button className="btn primary" onClick={() => handleUpdateStatus("ACCEPTED")} disabled={updating}>
                  Accept Order
                </button>
                <button className="btn" onClick={handleCancelOrder} style={{ color: "var(--red)" }} disabled={updating}>
                  Cancel Order
                </button>
              </>
            )}
            {order.col === "accepted" && (
              <>
                <button className="btn primary" onClick={() => handleUpdateStatus("PREPARING")} disabled={updating}>
                  Mark Preparing
                </button>
                <button className="btn" onClick={handleCancelOrder} style={{ color: "var(--red)" }} disabled={updating}>
                  Cancel Order
                </button>
              </>
            )}
            {order.col === "preparing" && (
              <button className="btn primary" onClick={() => handleUpdateStatus("READY")} disabled={updating}>
                Mark Ready
              </button>
            )}
            {order.col === "ready" && (
              <button className="btn primary" onClick={() => handleUpdateStatus("DELIVERED")} disabled={updating}>
                Mark Delivered
              </button>
            )}
            {(order.col === "completed" || order.col === "cancelled") && (
              <div style={{ color: "var(--text3)", fontSize: 12 }}>No actions available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Charts({ hourData, pieData, channels }) {
  const axisProps = {
    style: { fontSize: 10, fill: "var(--text3)" },
    axisLine: false,
    tickLine: false,
  };

  const tooltipStyle = {
    contentStyle: {
      background: "var(--bg3)", border: "1px solid var(--border)",
      borderRadius: 6, fontSize: 11, color: "var(--text)",
    },
    labelStyle: { color: "var(--text2)" },
  };

  return (
    <div className="charts-grid">
      {/* Orders by Hour */}
      <div className="chart-card">
        <div className="section-header">
          <div className="section-title">Orders by Hour</div>
          <div style={{ fontSize: 11, color: "var(--green)" }}>Live outlet metrics</div>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={hourData} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="h" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip {...tooltipStyle} />
            <Area type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={1.5} fill="url(#ordersGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Status Donut */}
      <div className="chart-card">
        <div className="section-header">
          <div className="section-title">Order Status</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={2} dataKey="value">
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {pieData.map((d) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                <span style={{ color: "var(--text2)", minWidth: 70 }}>{d.name}</span>
                <span style={{ fontWeight: 600 }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue by Channel */}
      <div className="chart-card">
        <div className="section-header">
          <div className="section-title">Revenue by Channel</div>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart
            data={channels}
            margin={{ top: 5, right: 0, bottom: 0, left: -20 }}
          >
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="rev" fill="#3b82f6" opacity={0.8} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function DashboardHeader() {
  const selectedOutlet = useSelector((state) => state.auth.selectedOutlet);

  const [ordersList, setOrdersList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);

  const fetchOrders = useCallback(async () => {
    if (!selectedOutlet) return;
    try {
      const res = await axiosInstance.get(`/orders?outletId=${selectedOutlet.id}&limit=100`);
      if (res.data && res.data.data && res.data.data.orders) {
        setOrdersList(res.data.data.orders);
      }
    } catch (err) {
      console.error("Dashboard failed to load orders", err);
    }

    try {
      const res = await axiosInstance.get(`/inventory/low-stock?outletId=${selectedOutlet.id}&limit=1`);
      if (res.data && res.data.data && res.data.data.pagination) {
        setLowStockCount(res.data.data.pagination.total || 0);
      }
    } catch (err) {
      console.error("Dashboard failed to load low stock inventory count", err);
    }
  }, [selectedOutlet]);

  // Periodic polling instead of websockets
  useEffect(() => {
    if (!selectedOutlet) return;
    fetchOrders();
    const t = setInterval(fetchOrders, 15000); // Poll every 15s
    return () => clearInterval(t);
  }, [selectedOutlet, fetchOrders]);

  const handleUpdateStatus = async (id, nextStatus) => {
    const loadingToast = toast.loading(`Advancing order...`);
    try {
      await axiosInstance.patch(`/orders/${id}/status`, {
        orderStatus: nextStatus,
      });
      toast.dismiss(loadingToast);
      toast.success("Order advanced!");
      fetchOrders();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to update status");
    }
  };

  const handleCancel = async (id) => {
    const reason = prompt("Enter cancellation reason:", "Rejected by manager");
    if (!reason) return;

    const loadingToast = toast.loading(`Cancelling order...`);
    try {
      await axiosInstance.patch(`/orders/${id}/cancel`, {
        cancellationReason: reason,
      });
      toast.dismiss(loadingToast);
      toast.success("Order cancelled!");
      fetchOrders();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to cancel order");
    }
  };

  const handleSelectCard = async (card) => {
    const loadingToast = toast.loading("Loading drawer details...");
    try {
      const res = await axiosInstance.get(`/orders/${card.realId}`);
      toast.dismiss(loadingToast);
      if (res.data && res.data.data) {
        // Build matching detailed card
        setSelectedOrder({
          ...card,
          items: res.data.data.items,
          original: res.data.data,
        });
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error(err);
      toast.error("Failed to load details");
    }
  };

  // Grouping orders for Command Center
  const groupedOrders = {
    new: [],
    accepted: [],
    preparing: [],
    ready: [],
    completed: [],
    cancelled: [],
  };

  ordersList.forEach((o) => {
    let col = "new";
    const status = o.orderStatus;
    if (status === "PENDING") col = "new";
    else if (status === "ACCEPTED") col = "accepted";
    else if (status === "PREPARING") col = "preparing";
    else if (status === "READY") col = "ready";
    else if (status === "DELIVERED" || status === "COMPLETED") col = "completed";
    else if (status === "CANCELLED") col = "cancelled";
    
    // Tab filters
    if (activeTab === "live" && (col === "completed" || col === "cancelled")) return;
    if (activeTab === "pending" && col !== "new") return;
    if (activeTab === "completed" && col !== "completed") return;

    const customerName = o.customerId 
      ? `${o.customerId.firstName} ${o.customerId.lastName || ""}`
      : "Walk-in Customer";
      
    const createdTime = new Date(o.createdAt).getTime();
    const nowTime = Date.now();
    const mins = Math.max(0, Math.round((nowTime - createdTime) / 60000));
    const sla = Math.max(0, 100 - mins * 3.3); // simple 30 min SLA decrease

    groupedOrders[col].push({
      id: o.orderNumber || o.id,
      realId: o.id,
      col,
      name: customerName,
      ch: o.source,
      val: o.totalAmount,
      pr: mins > 20 ? "high" : mins > 10 ? "med" : "low",
      mins,
      sla,
      paid: o.paymentStatus === "PAID",
      delivery: o.source === "DELIVERY" ? "Delivery" : "Pickup",
      original: o,
    });
  });

  // Calculate stats cards
  const totalRevenue = ordersList
    .filter(o => o.orderStatus === "DELIVERED" || o.orderStatus === "COMPLETED")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const activeOrdersCount = ordersList
    .filter(o => o.orderStatus !== "DELIVERED" && o.orderStatus !== "COMPLETED" && o.orderStatus !== "CANCELLED")
    .length;
  const uniqueCustomers = new Set(ordersList.map(o => o.customerId?.id || o.customerId?._id || o.customerId)).size;
  const avgOrderValue = ordersList.length > 0 ? Math.round(totalRevenue / ordersList.length) : 0;

  const calculatedStats = [
    {
      id: "revenue",
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      trend: totalRevenue > 0 ? 12.4 : 0,
      note: "From settled payments",
      accent: "#635bff",
      accentBg: "rgba(99,91,255,.12)",
      Icon: DollarSign,
    },
    {
      id: "orders",
      label: "Total Orders",
      value: ordersList.length.toString(),
      trend: ordersList.length > 0 ? 8.1 : 0,
      note: `Active: ${activeOrdersCount}`,
      accent: "#f59e0b",
      accentBg: "rgba(245,158,11,.12)",
      Icon: ShoppingBag,
    },
    {
      id: "customers",
      label: "Active Customers",
      value: uniqueCustomers.toString(),
      trend: uniqueCustomers > 0 ? 4.5 : 0,
      note: "Distinct customer index",
      accent: "#06b6d4",
      accentBg: "rgba(6,182,212,.12)",
      Icon: Users,
    },
    {
      id: "inventory",
      label: "Inventory Alerts",
      value: lowStockCount.toString(),
      trend: 0,
      note: "Low stock items count",
      accent: "#10b981",
      accentBg: "rgba(16,185,129,.12)",
      Icon: Package,
    },
    {
      id: "staff",
      label: "Staff Online",
      value: "4",
      trend: 0,
      note: "Standard scheduling",
      accent: "#f43f5e",
      accentBg: "rgba(244,63,94,.12)",
      Icon: Activity,
    },
    {
      id: "aov",
      label: "Avg Order Value",
      value: `₹${avgOrderValue}`,
      trend: avgOrderValue > 0 ? 2.9 : 0,
      note: "Per ticket billing",
      accent: "#a78bfa",
      accentBg: "rgba(167,139,250,.12)",
      Icon: TrendingUp,
    },
  ];

  // Calculate dynamic pie charts
  const finished = ordersList.filter(o => o.orderStatus === "DELIVERED" || o.orderStatus === "COMPLETED").length;
  const preparing = ordersList.filter(o => o.orderStatus === "PREPARING").length;
  const pending = ordersList.filter(o => o.orderStatus === "PENDING" || o.orderStatus === "ACCEPTED").length;
  const cancelled = ordersList.filter(o => o.orderStatus === "CANCELLED").length;
  const totalChartOrders = ordersList.length || 1;
  const calculatedPieData = [
    { name: "Completed", value: Math.round((finished / totalChartOrders) * 100), color: "#10b981" },
    { name: "Preparing", value: Math.round((preparing / totalChartOrders) * 100), color: "#f59e0b" },
    { name: "New/Accept", value: Math.round((pending / totalChartOrders) * 100), color: "#3b82f6" },
    { name: "Cancelled", value: Math.round((cancelled / totalChartOrders) * 100), color: "#ef4444" },
  ];

  // Calculate dynamic channels revenue
  const channelMap = { DINE_IN: 0, TAKEAWAY: 0, DELIVERY: 0, ONLINE: 0 };
  ordersList.forEach(o => {
    if (channelMap[o.source] !== undefined) {
      channelMap[o.source] += o.totalAmount;
    }
  });
  const calculatedChannels = [
    { name: "DINE", rev: channelMap.DINE_IN },
    { name: "TAKE", rev: channelMap.TAKEAWAY },
    { name: "DELV", rev: channelMap.DELIVERY },
    { name: "ONLN", rev: channelMap.ONLINE },
  ];

  // Calculate dynamic hourly data
  const hourMap = {};
  ordersList.forEach(o => {
    if (o.createdAt) {
      const hr = new Date(o.createdAt).getHours();
      const suffix = hr >= 12 ? "PM" : "AM";
      const displayHr = `${hr % 12 === 0 ? 12 : hr % 12}${suffix}`;
      hourMap[displayHr] = (hourMap[displayHr] || 0) + 1;
    }
  });
  const standardHours = ["8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM", "10PM"];
  const calculatedHourData = standardHours.map(h => ({
    h,
    orders: hourMap[h] || 0,
  }));

  if (!selectedOutlet) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "calc(100vh - 120px)", color: "var(--text3)", gap: 10 }}>
        <div style={{ fontSize: 32 }}>🏪</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>No Active Outlet Selected</div>
        <div style={{ fontSize: 13, maxWidth: 300, textAlign: "center" }}>Please select an active outlet from the header dropdown to start loading analytics dashboard.</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="header-row">
          <div>
            <div className="page-title">Order Aggregation</div>
            <div className="page-sub">Monitor and manage all restaurant orders from every channel in one place for {selectedOutlet.name}.</div>
          </div>
          <div className="header-actions">
            <button className="btn" onClick={fetchOrders}>Refresh Dashboard</button>
            <button className="btn">Multi-Outlet View</button>
            <button className="btn primary">+ New Order</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[
          { key: "all",       label: "All Channels"    },
          { key: "live",      label: "Live Orders"     },
          { key: "pending",   label: "Pending Action"  },
          { key: "completed", label: "Completed"       },
        ].map((t) => (
          <div
            key={t.key}
            className={`tab${activeTab === t.key ? " active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </div>
        ))}
      </div>

      {/* KPI Cards */}
      <div>
        <StatsCards stats={calculatedStats} />
      </div>

      {/* Command Center + Intel Panel */}
      <div className="two-col">
        <CommandCenter 
          orders={groupedOrders} 
          onSelect={handleSelectCard} 
          onUpdateStatus={handleUpdateStatus}
          onCancel={handleCancel}
          onRefresh={fetchOrders}
        />
        <IntelPanel />
      </div>

      {/* Charts */}
      <div>
        <Charts 
          hourData={calculatedHourData} 
          pieData={calculatedPieData} 
          channels={calculatedChannels} 
        />
      </div>

      {/* Order Drawer */}
      {selectedOrder && (
        <OrderDrawer 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
          onRefresh={fetchOrders}
        />
      )}
    </div>
  );
}