import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  NAMES, CH_COLORS, CH_SRC, ITEMS_POOL, COL_META,
  KITCHEN_LOAD, AI_RECS, STAFF, INVENTORY_RISK,
  CHANNELS, HOUR_DATA, PIE_DATA
} from "../../../data/data";
import StatsCards from "./StateCard";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
let _id = 1000;
function makeOrder(col, priorityBias = 0.2) {
  const name  = NAMES[Math.floor(Math.random() * NAMES.length)];
  const ch    = CH_SRC[Math.floor(Math.random() * CH_SRC.length)];
  const items = ITEMS_POOL[Math.floor(Math.random() * ITEMS_POOL.length)].map(itemName => ({
    name: itemName,
    qty: Math.floor(Math.random() * 3) + 1,
    price: Math.floor(200 + Math.random() * 600)
  }));
  const val   = Math.floor(800 + Math.random() * 2400);
  const pr    = Math.random() < priorityBias ? "high" : Math.random() < 0.4 ? "med" : "low";
  const mins  = Math.floor(2 + Math.random() * 45);
  const sla   = Math.floor(30 + Math.random() * 70);
  return { id: `ORD-${++_id}`, col, name, ch, items, val, pr, mins, sla, paid: Math.random() > 0.2, delivery: Math.random() > 0.4 ? "Delivery" : "Pickup" };
}

function makeOrders(col, count, bias) {
  return Array.from({ length: count }, () => makeOrder(col, bias));
}

const INITIAL_ORDERS = {
  new:       makeOrders("new",       4, 0.4),
  accepted:  makeOrders("accepted",  3, 0.3),
  preparing: makeOrders("preparing", 5, 0.2),
  ready:     makeOrders("ready",     2, 0.1),
  completed: makeOrders("completed", 7, 0.0),
  cancelled: makeOrders("cancelled", 2, 0.0),
};

// ─── ICON PRIMITIVES ─────────────────────────────────────────────────────────
const IClose    = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IFilter   = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const IRefresh  = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;

const Badge = ({ children, variant = "gray" }) => (
  <span className={`badge badge-${variant}`}>{children}</span>
);

function OrderCard({ order, onSelect }) {
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
        <div className="oc-actions">
          <button className="oc-btn accept">Accept</button>
          <button className="oc-btn reject">Reject</button>
        </div>
      )}
    </div>
  );
}

function CommandCenter({ orders, onSelect }) {
  return (
    <div className="command-center">
      <div className="cc-header">
        <div>
          <div className="cc-title">Live Orders Command Center</div>
          <div className="cc-subtitle">Real-time across all channels · Auto-refresh every 30s</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn"><IFilter /> Filter</button>
          <button className="btn primary"><IRefresh /> Refresh</button>
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
                  <OrderCard key={o.id + i} order={o} onSelect={onSelect} />
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

function OrderDrawer({ order, onClose }) {
  if (!order) return null;

  const timeline = [
    { color: "var(--green)", time: "12:04", text: `Order placed via ${order.ch}` },
    { color: "var(--accent)", time: "12:05", text: "Assigned to kitchen" },
    { color: "var(--amber)", time: "12:08", text: "Preparation started" },
    ...(order.col === "ready" ? [{ color: "var(--teal)", time: "12:22", text: "Ready for pickup/delivery" }] : []),
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
          {order.items.map((item, i) => (
            <div key={i} className="item-row">
              <div>
                <div className="item-name">{item.name}</div>
                <div className="item-qty">Qty: {item.qty}</div>
              </div>
              <div className="item-price">₹{item.price}</div>
            </div>
          ))}
          <div className="item-total">
            <span>Total</span>
            <span>₹{order.val.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment */}
        <div className="drawer-section">
          <div className="ds-title">Payment Details</div>
          {[
            ["Method", "UPI – PhonePe"],
            ["Status", order.paid ? "Paid" : "Pending"],
            ["Transaction ID", "TXN-MOCK-" + order.id.replace("ORD-", "")],
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
            {["Accept Order", "Mark Ready", "Add Note", "Print KOT", "Assign Rider"].map((a) => (
              <button key={a} className={`btn${a === "Accept Order" ? " primary" : ""}`}>{a}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Charts() {
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
          <div style={{ fontSize: 11, color: "var(--green)" }}>+18% vs yesterday</div>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={HOUR_DATA} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
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
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={2} dataKey="value">
                {PIE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {PIE_DATA.map((d) => (
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
            data={CHANNELS.map((c) => ({ name: c.name.slice(0, 3), rev: parseFloat(c.rev.replace(/[₹L]/g, "")) }))}
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
  const [orders, setOrders]             = useState(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab]       = useState("all");

  // Simulate live incoming orders
  useEffect(() => {
    const t = setInterval(() => {
      if (Math.random() > 0.6) {
        const newOrder = makeOrder("new", 0.3);
        setOrders((o) => ({ ...o, new: [newOrder, ...o.new].slice(0, 8) }));
      }
    }, 8000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="header-row">
          <div>
            <div className="page-title">Order Aggregation</div>
            <div className="page-sub">Monitor and manage all restaurant orders from every channel in one place.</div>
          </div>
          <div className="header-actions">
            <button className="btn">Export</button>
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
        <StatsCards />
      </div>

      {/* Command Center + Intel Panel */}
      <div className="two-col">
        <CommandCenter orders={orders} onSelect={setSelectedOrder} />
        <IntelPanel />
      </div>

      {/* Charts */}
      <div>
        <Charts />
      </div>

      {/* Order Drawer */}
      {selectedOrder && (
        <OrderDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}