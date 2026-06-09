import { useState} from "react";
import {
  AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

// ─── DESIGN TOKENS ────────────────────────────────────────────────
const T = {
  navy: "#0F172A", slate: "#334155", blue: "#2563EB", blueLight: "#EFF6FF",
  success: "#16A34A", successLight: "#F0FDF4",
  warning: "#D97706", warningLight: "#FFFBEB",
  error: "#DC2626", errorLight: "#FEF2F2",
  bg: "#F8FAFC", card: "#FFFFFF", border: "#E2E8F0",
  text: "#0F172A", muted: "#64748B",
};

// ─── MOCK DATA ────────────────────────────────────────────────────
const revenueDaily = [
  { d: "26M", v: 142 }, { d: "27", v: 168 }, { d: "28", v: 155 },
  { d: "29", v: 172 }, { d: "30", v: 190 }, { d: "31", v: 134 },
  { d: "1J", v: 201 }, { d: "2", v: 178 }, { d: "3", v: 195 },
  { d: "4", v: 214 }, { d: "5", v: 188 }, { d: "6", v: 223 },
  { d: "7", v: 207 }, { d: "8", v: 248 },
];
const revenueMonthly = [
  { d: "Jan", v: 320, prev: 280 }, { d: "Feb", v: 380, prev: 310 },
  { d: "Mar", v: 410, prev: 350 }, { d: "Apr", v: 390, prev: 370 },
  { d: "May", v: 460, prev: 400 }, { d: "Jun", v: 482, prev: 420 },
];
const platformSplit = [
  { name: "Swiggy", value: 42, color: "#F97316" },
  { name: "Zomato", value: 31, color: "#DC2626" },
  { name: "Own App", value: 18, color: "#2563EB" },
  { name: "Dunzo", value: 9, color: "#7C3AED" },
];
const customerGrowth = [
  { d: "Jan", new: 2100, ret: 4200 }, { d: "Feb", new: 2400, ret: 4800 },
  { d: "Mar", new: 2800, ret: 5100 }, { d: "Apr", new: 2650, ret: 5400 },
  { d: "May", new: 3200, ret: 5800 }, { d: "Jun", new: 3841, ret: 6100 },
];
const hourlyOrders = [
  { h: "9AM", v: 12 }, { h: "10AM", v: 28 }, { h: "11AM", v: 45 },
  { h: "12PM", v: 98 }, { h: "1PM", v: 124 }, { h: "2PM", v: 87 },
  { h: "3PM", v: 56 }, { h: "4PM", v: 43 }, { h: "5PM", v: 62 },
  { h: "6PM", v: 91 }, { h: "7PM", v: 138 }, { h: "8PM", v: 162 },
  { h: "9PM", v: 148 }, { h: "10PM", v: 87 },
];
const outletPerf = [
  { name: "Connaught Place", city: "New Delhi", rev: "₹4.8L", orders: 1842, rating: 4.8, status: "live", growth: 12 },
  { name: "Bandra West", city: "Mumbai", rev: "₹3.9L", orders: 1524, rating: 4.3, status: "live", growth: 8 },
  { name: "Koramangala", city: "Bengaluru", rev: "₹3.2L", orders: 1210, rating: 4.5, status: "throttled", growth: -3 },
  { name: "Salt Lake Sec V", city: "Kolkata", rev: "₹2.7L", orders: 984, rating: 3.9, status: "offline", growth: -12 },
  { name: "Jubilee Hills", city: "Hyderabad", rev: "₹2.4L", orders: 910, rating: 4.6, status: "live", growth: 19 },
  { name: "T Nagar", city: "Chennai", rev: "₹2.1L", orders: 820, rating: 4.1, status: "live", growth: 6 },
];
const topItems = [
  { icon: "🍔", name: "Classic Smash Burger", cat: "Burgers", orders: 2841, rev: "₹5.1L", trend: 8 },
  { icon: "🍟", name: "Loaded Cheese Fries", cat: "Sides", orders: 1924, rev: "₹2.9L", trend: 5 },
  { icon: "🥤", name: "Salted Caramel Shake", cat: "Beverages", orders: 1512, rev: "₹1.8L", trend: -2 },
  { icon: "🌮", name: "Crispy Chicken Wrap", cat: "Wraps", orders: 1180, rev: "₹1.5L", trend: 14 },
  { icon: "🍰", name: "NY Cheesecake Slice", cat: "Desserts", orders: 752, rev: "₹1.1L", trend: 22 },
];
const orders = Array.from({ length: 40 }, (_, i) => {
  const customers = ["Priya Sharma","Rahul Verma","Ananya Iyer","Vikram Singh","Meera Nair","Arjun Kapoor","Deepika Roy","Suresh Patel","Kavitha Reddy","Nikhil Gupta"];
  const outlets = ["Connaught Place","Bandra West","Koramangala","Salt Lake Sec V","Jubilee Hills","T Nagar"];
  const platforms = ["Swiggy","Zomato","Own App","Dunzo"];
  const statuses = ["new","preparing","ready","delivered","delivered","delivered","cancelled"];
  const amounts = [156,224,318,398,442,478,510,642,720,890,1120,1284];
  const times = ["2m ago","8m ago","14m ago","22m ago","35m ago","1h ago","1h ago","2h ago","2h ago","3h ago"];
  return {
    id: `#ORD-${18294 - i}`,
    customer: customers[i % customers.length],
    outlet: outlets[i % outlets.length],
    platform: platforms[i % platforms.length],
    amount: `₹${amounts[i % amounts.length]}`,
    status: statuses[i % statuses.length],
    time: times[i % times.length],
  };
});
const inventory = [
  { name: "Burger Buns (Sesame)", cat: "Breads", qty: 12, threshold: 150, pct: 8, alert: "critical", updated: "2h ago" },
  { name: "Chicken Patty (250g)", cat: "Proteins", qty: 48, threshold: 200, pct: 24, alert: "low", updated: "1h ago" },
  { name: "Cheddar Slices", cat: "Dairy", qty: 31, threshold: 180, pct: 17, alert: "low", updated: "45m ago" },
  { name: "Potato (25kg bag)", cat: "Vegetables", qty: 3, threshold: 60, pct: 5, alert: "critical", updated: "30m ago" },
  { name: "Iceberg Lettuce", cat: "Vegetables", qty: 120, threshold: 100, pct: 100, alert: "ok", updated: "1h ago" },
  { name: "Ketchup (1L)", cat: "Condiments", qty: 84, threshold: 50, pct: 100, alert: "ok", updated: "3h ago" },
  { name: "Coca-Cola 330ml (case)", cat: "Beverages", qty: 22, threshold: 40, pct: 55, alert: "low", updated: "20m ago" },
  { name: "Brioche Buns", cat: "Breads", qty: 68, threshold: 80, pct: 85, alert: "ok", updated: "1h ago" },
  { name: "Beef Patty (180g)", cat: "Proteins", qty: 94, threshold: 120, pct: 78, alert: "ok", updated: "2h ago" },
  { name: "Tomatoes (kg)", cat: "Vegetables", qty: 8, threshold: 30, pct: 27, alert: "low", updated: "1h ago" },
  { name: "Mozzarella (kg)", cat: "Dairy", qty: 4, threshold: 20, pct: 20, alert: "critical", updated: "3h ago" },
  { name: "Pizza Dough Balls", cat: "Breads", qty: 45, threshold: 60, pct: 75, alert: "ok", updated: "2h ago" },
];
const restaurants = [
  { icon: "🍔", name: "Burger Nation", cat: "Fast Food", outlets: 9, rev: "₹18.4L", orders: 6842, rating: 4.4, status: "live", cities: "Delhi, Mumbai, Bengaluru +6", color: "#0F172A" },
  { icon: "🍕", name: "Pizza Republic", cat: "Pizzeria", outlets: 7, rev: "₹14.2L", orders: 5210, rating: 4.8, status: "live", cities: "Mumbai, Hyderabad, Pune +4", color: "#1a2e1a" },
  { icon: "🍜", name: "Noodle House", cat: "Asian", outlets: 5, rev: "₹9.8L", orders: 3940, rating: 3.7, status: "issues", cities: "Bengaluru, Chennai, Kolkata +2", color: "#2d1a00" },
  { icon: "🥗", name: "Green Bowl", cat: "Healthy", outlets: 3, rev: "₹5.8L", orders: 2302, rating: 4.6, status: "live", cities: "Bengaluru, Mumbai, Delhi", color: "#0a1f0a" },
];
const categoryPerf = [
  { cat: "Burgers", orders: 8412, rev: "₹21.4L", aov: "₹254", pct: 46, trend: 8 },
  { cat: "Sides & Fries", orders: 5920, rev: "₹10.2L", aov: "₹172", pct: 22, trend: 5 },
  { cat: "Pizzas", orders: 4810, rev: "₹9.6L", aov: "₹200", pct: 20, trend: 11 },
  { cat: "Beverages", orders: 3210, rev: "₹8.8L", aov: "₹274", pct: 8, trend: -2 },
  { cat: "Desserts", orders: 752, rev: "₹3.8L", aov: "₹505", pct: 4, trend: 14 },
];
const activityFeed = [
  { color: T.blue, text: "Order #ORD-18294 created at Connaught Place", time: "2 min ago", icon: "receipt" },
  { color: T.success, text: "Order #ORD-18291 accepted by kitchen", time: "5 min ago", icon: "check" },
  { color: T.warning, text: "Inventory alert: Burger Buns at Bandra West below threshold", time: "12 min ago", icon: "alert-triangle" },
  { color: T.muted, text: "Vikram Singh logged into manager console", time: "18 min ago", icon: "user" },
  { color: T.success, text: "Koramangala went live on Swiggy integration", time: "34 min ago", icon: "plug" },
  { color: T.error, text: "Order #ORD-18277 cancelled — payment declined", time: "41 min ago", icon: "x-circle" },
  { color: T.blue, text: "Menu sync completed for Pizza Republic", time: "1h ago", icon: "refresh" },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────
function StatusPill({ status }) {
  const cfg = {
    live:      { bg: T.successLight, col: T.success, label: "● Live" },
    throttled: { bg: T.warningLight, col: T.warning, label: "⚠ Throttled" },
    offline:   { bg: "#F1F5F9",      col: T.muted,   label: "○ Offline" },
    issues:    { bg: T.warningLight, col: T.warning, label: "⚠ Issues" },
    new:       { bg: T.blueLight,    col: T.blue,    label: "New" },
    preparing: { bg: T.warningLight, col: T.warning, label: "Preparing" },
    ready:     { bg: "#F0F9FF",      col: "#0369A1", label: "Ready" },
    delivered: { bg: T.successLight, col: T.success, label: "Delivered" },
    cancelled: { bg: T.errorLight,   col: T.error,   label: "Cancelled" },
  };
  const c = cfg[status] || cfg.offline;
  return (
    <span style={{ background: c.bg, color: c.col, padding: "2px 9px", borderRadius: 20, fontSize: 11.5, fontWeight: 500 }}>
      {c.label}
    </span>
  );
}

function Stars({ rating }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? "#F59E0B" : "#E2E8F0", fontSize: 11 }}>★</span>
      ))}
      <span style={{ fontSize: 11, color: T.muted, marginLeft: 3 }}>{rating.toFixed(1)}</span>
    </span>
  );
}

function KpiCard({ label, value, badge, badgeUp, sub }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: T.navy, letterSpacing: "-0.8px", margin: "6px 0 8px" }}>{value}</div>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 3, background: badgeUp ? T.successLight : T.errorLight, color: badgeUp ? T.success : T.error, padding: "2px 8px", borderRadius: 20, fontSize: 11.5, fontWeight: 500 }}>
        {badgeUp ? "▲" : "▼"} {badge}
      </span>
      {sub && <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function SectionCard({ title, action, children, extra }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: T.navy }}>{title}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {extra}
          {action && <span style={{ fontSize: 12, color: T.blue, cursor: "pointer", fontWeight: 500 }}>{action}</span>}
        </span>
      </div>
      {children}
    </div>
  );
}

const customTooltipStyle = {
  background: T.navy, border: "none", borderRadius: 6, padding: "6px 10px", fontSize: 11.5, color: "#fff"
};
function CustomTooltip({ active, payload, label, prefix = "₹", suffix = "K" }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={customTooltipStyle}>
      <div style={{ color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: "#fff", fontWeight: 600 }}>{prefix}{p.value}{suffix}</div>
      ))}
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────
function DashboardPage() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: T.navy, letterSpacing: "-0.4px" }}>Operations Overview</div>
        <div style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>Monday, 9 June 2026 · Burger Nation Group · 24 active outlets</div>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        <KpiCard label="Total Revenue" value="₹48.2L" badge="+12.4%" badgeUp sub="vs last 30 days" />
        <KpiCard label="Total Orders" value="18,294" badge="+8.1%" badgeUp sub="vs last 30 days" />
        <KpiCard label="Active Outlets" value="24" badge="+2 new" badgeUp sub="across 8 cities" />
        <KpiCard label="Avg Order Value" value="₹263" badge="-1.8%" sub="vs last 30 days" />
      </div>

      {/* Revenue + Order Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 310px", gap: 12, marginBottom: 20 }}>
        <SectionCard
          title="Revenue Analytics"
          extra={
            <div style={{ display: "flex", gap: 2, background: T.bg, borderRadius: 6, padding: 3 }}>
              {["Daily","Weekly","Monthly"].map((t, i) => (
                <span key={t} style={{ fontSize: 11.5, padding: "3px 10px", borderRadius: 4, cursor: "pointer", fontWeight: 500, background: i === 0 ? T.card : "transparent", color: i === 0 ? T.navy : T.muted, boxShadow: i === 0 ? "0 1px 2px rgba(0,0,0,0.05)" : "none" }}>{t}</span>
              ))}
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={revenueDaily} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: T.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: T.muted }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="v" radius={[3,3,0,0]}>
                {revenueDaily.map((_, i) => (
                  <Cell key={i} fill={i === revenueDaily.length - 1 ? T.blue : "#BFDBFE"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Order Activity" extra={<span style={{ fontSize: 11, color: T.muted }}>Today</span>}>
          {[
            { label: "New", count: 148, color: T.blue, pct: 85 },
            { label: "Preparing", count: 63, color: T.warning, pct: 45 },
            { label: "Ready", count: 29, color: "#0891B2", pct: 22 },
            { label: "Delivered", count: 412, color: T.success, pct: 100 },
            { label: "Cancelled", count: 11, color: T.error, pct: 8 },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 70, fontSize: 11.5, color: T.muted, flexShrink: 0 }}>{s.label}</div>
              <div style={{ flex: 1, height: 5, background: T.border, borderRadius: 3 }}>
                <div style={{ width: `${s.pct}%`, height: 5, background: s.color, borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: s.color, minWidth: 34, textAlign: "right" }}>{s.count}</div>
            </div>
          ))}
          <div style={{ marginTop: 10, borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
            <ResponsiveContainer width="100%" height={90}>
              <PieChart>
                <Pie data={platformSplit} cx="50%" cy="50%" innerRadius={28} outerRadius={42} dataKey="value" paddingAngle={2}>
                  {platformSplit.map((p, i) => <Cell key={i} fill={p.color} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v}%`, n]} contentStyle={customTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              {platformSplit.map(p => (
                <span key={p.name} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10.5, color: T.muted }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, display: "inline-block" }} />
                  {p.name} {p.value}%
                </span>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Outlet Performance + Top Items */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 12, marginBottom: 20 }}>
        <SectionCard title="Outlet Performance" action="View all →">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Outlet","Revenue","Orders","Rating","Growth","Status"].map(h => (
                  <th key={h} style={{ fontSize: 11, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: "0.4px", padding: "0 0 10px", textAlign: "left", borderBottom: `1px solid ${T.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {outletPerf.map((o, i) => (
                <tr key={i}>
                  <td style={{ padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ fontWeight: 600, fontSize: 12.5, color: T.navy }}>{o.name}</div>
                    <div style={{ fontSize: 11, color: T.muted }}>{o.city}</div>
                  </td>
                  <td style={{ padding: "10px 0", fontWeight: 700, color: T.navy, fontSize: 12.5, borderBottom: `1px solid ${T.border}` }}>{o.rev}</td>
                  <td style={{ padding: "10px 0", fontSize: 12.5, color: T.slate, borderBottom: `1px solid ${T.border}` }}>{o.orders.toLocaleString()}</td>
                  <td style={{ padding: "10px 0", borderBottom: `1px solid ${T.border}` }}><Stars rating={o.rating} /></td>
                  <td style={{ padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
                    <span style={{ color: o.growth > 0 ? T.success : T.error, fontSize: 12, fontWeight: 600 }}>
                      {o.growth > 0 ? "▲" : "▼"} {Math.abs(o.growth)}%
                    </span>
                  </td>
                  <td style={{ padding: "10px 0", borderBottom: `1px solid ${T.border}` }}><StatusPill status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>

        <SectionCard title="Top Selling Items" action="View menu →">
          {topItems.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < topItems.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{item.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 12, color: T.navy, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                <div style={{ fontSize: 11, color: T.muted }}>{item.orders.toLocaleString()} orders</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: T.navy }}>{item.rev}</div>
                <div style={{ fontSize: 10.5, color: item.trend > 0 ? T.success : T.error }}>{item.trend > 0 ? "▲" : "▼"}{Math.abs(item.trend)}%</div>
              </div>
            </div>
          ))}
        </SectionCard>
      </div>

      {/* Hourly + Inventory + Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
        <SectionCard title="Hourly Orders" extra={<span style={{ fontSize: 11, color: T.muted }}>Today</span>}>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={hourlyOrders}>
              <defs>
                <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={T.blue} stopOpacity={0.12} />
                  <stop offset="95%" stopColor={T.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="h" tick={{ fontSize: 9.5, fill: T.muted }} axisLine={false} tickLine={false} interval={1} />
              <YAxis tick={{ fontSize: 9.5, fill: T.muted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={customTooltipStyle} formatter={v => [v, "Orders"]} />
              <Area type="monotone" dataKey="v" stroke={T.blue} strokeWidth={2} fill="url(#hg)" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Inventory Alerts" extra={<span style={{ background: T.errorLight, color: T.error, fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 500 }}>7 critical</span>}>
          {inventory.slice(0, 6).map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: i < 5 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ flex: 1, fontSize: 12, fontWeight: 500, color: T.navy, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
              <div style={{ width: 60, height: 4, background: T.border, borderRadius: 2, flexShrink: 0 }}>
                <div style={{ width: `${item.pct}%`, height: 4, background: item.alert === "critical" ? T.error : item.alert === "low" ? T.warning : T.success, borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 11, padding: "1px 6px", borderRadius: 20, fontWeight: 500, background: item.alert === "critical" ? T.errorLight : item.alert === "low" ? T.warningLight : T.successLight, color: item.alert === "critical" ? T.error : item.alert === "low" ? T.warning : T.success, flexShrink: 0 }}>
                {item.alert === "critical" ? "Critical" : item.alert === "low" ? "Low" : "OK"}
              </span>
            </div>
          ))}
        </SectionCard>

        <SectionCard title="Recent Activity" action="View log →">
          {activityFeed.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "7px 0", borderBottom: i < activityFeed.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: a.color, marginTop: 4, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 12, color: T.navy }} dangerouslySetInnerHTML={{ __html: a.text.replace(/#ORD-\d+/g, m => `<strong>${m}</strong>`) }} />
                <div style={{ fontSize: 11, color: T.muted, marginTop: 1 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </SectionCard>
      </div>
    </div>
  );
}

// ─── ORDERS PAGE ──────────────────────────────────────────────────
function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const pageSize = 15;

  const filtered = orders.filter(o => {
    const s = search.toLowerCase();
    const matchesSearch = !s || o.id.toLowerCase().includes(s) || o.customer.toLowerCase().includes(s) || o.outlet.toLowerCase().includes(s);
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const toggleAll = () => setSelected(selected.length === paged.length ? [] : paged.map(o => o.id));
  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.navy, letterSpacing: "-0.4px" }}>Order Management</div>
          <div style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>18,294 total orders · {filtered.length} matching current filters</div>
        </div>
        <button style={{ background: T.blue, color: "#fff", border: "none", borderRadius: 6, padding: "0 16px", height: 34, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>+ New Order</button>
      </div>

      {/* Summary tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { label: "New", count: 148, color: T.blue, bg: T.blueLight },
          { label: "Preparing", count: 63, color: T.warning, bg: T.warningLight },
          { label: "Ready", count: 29, color: "#0369A1", bg: "#F0F9FF" },
          { label: "Delivered", count: 412, color: T.success, bg: T.successLight },
          { label: "Cancelled", count: 11, color: T.error, bg: T.errorLight },
        ].map(s => (
          <div key={s.label} onClick={() => setStatusFilter(statusFilter === s.label.toLowerCase() ? "all" : s.label.toLowerCase())} style={{ background: statusFilter === s.label.toLowerCase() ? s.bg : T.card, border: `1px solid ${statusFilter === s.label.toLowerCase() ? s.color + "44" : T.border}`, borderRadius: 8, padding: "12px 14px", cursor: "pointer", transition: "all 0.1s" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.count}</div>
            <div style={{ fontSize: 11.5, color: T.muted, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 16 }}>
        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "0 10px", height: 32, flexBasis: 220 }}>
            <span style={{ color: T.muted, fontSize: 13 }}>🔍</span>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search orders..." style={{ border: "none", background: "transparent", outline: "none", fontSize: 12.5, color: T.text, flex: 1 }} />
          </div>
          {[
            { label: "Status", options: ["all","new","preparing","ready","delivered","cancelled"], val: statusFilter, set: v => { setStatusFilter(v); setPage(1); } },
          ].map(f => (
            <select key={f.label} value={f.val} onChange={e => f.set(e.target.value)} style={{ height: 32, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "0 10px", fontSize: 12, color: T.text, outline: "none", cursor: "pointer" }}>
              {f.options.map(o => <option key={o} value={o}>{o === "all" ? "All Statuses" : o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
            </select>
          ))}
          <select style={{ height: 32, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "0 10px", fontSize: 12, color: T.text, outline: "none" }}>
            <option>All Outlets</option>
            {["Connaught Place","Bandra West","Koramangala","Salt Lake Sec V","Jubilee Hills","T Nagar"].map(o => <option key={o}>{o}</option>)}
          </select>
          <select style={{ height: 32, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "0 10px", fontSize: 12, color: T.text, outline: "none" }}>
            <option>All Platforms</option>
            <option>Swiggy</option><option>Zomato</option><option>Own App</option><option>Dunzo</option>
          </select>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {selected.length > 0 && (
              <button style={{ height: 32, background: T.errorLight, color: T.error, border: `1px solid ${T.error}44`, borderRadius: 6, padding: "0 12px", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                Cancel {selected.length} selected
              </button>
            )}
            <button style={{ height: 32, background: T.card, border: `1px solid ${T.border}`, borderRadius: 6, padding: "0 12px", fontSize: 12, color: T.text, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontWeight: 500 }}>
              ↓ Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: T.bg }}>
              <th style={{ width: 36, padding: "8px 12px", textAlign: "left", borderBottom: `1px solid ${T.border}`, borderRadius: "6px 0 0 0" }}>
                <input type="checkbox" checked={selected.length === paged.length && paged.length > 0} onChange={toggleAll} style={{ accentColor: T.blue }} />
              </th>
              {["Order ID","Customer","Outlet","Platform","Amount","Status","Created At",""].map((h, i) => (
                <th key={i} style={{ fontSize: 11, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: "0.4px", padding: "8px 12px", textAlign: "left", borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((o, i) => (
              <tr key={o.id} style={{ background: selected.includes(o.id) ? "#F0F9FF" : "transparent" }} onMouseEnter={e => { if (!selected.includes(o.id)) e.currentTarget.style.background = T.bg; }} onMouseLeave={e => { e.currentTarget.style.background = selected.includes(o.id) ? "#F0F9FF" : "transparent"; }}>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}` }}>
                  <input type="checkbox" checked={selected.includes(o.id)} onChange={() => toggle(o.id)} style={{ accentColor: T.blue }} />
                </td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ fontFamily: "monospace", fontSize: 12, color: T.blue, fontWeight: 600 }}>{o.id}</span>
                </td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, fontWeight: 500, fontSize: 12.5, color: T.navy }}>{o.customer}</td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, fontSize: 12.5, color: T.slate }}>{o.outlet}</td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ fontSize: 11.5, background: { Swiggy: "#FFF7ED", Zomato: "#FEF2F2", "Own App": T.blueLight, Dunzo: "#F5F3FF" }[o.platform], color: { Swiggy: "#C2410C", Zomato: "#B91C1C", "Own App": T.blue, Dunzo: "#6D28D9" }[o.platform], padding: "2px 8px", borderRadius: 20, fontWeight: 500 }}>{o.platform}</span>
                </td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, fontWeight: 700, fontSize: 13, color: T.navy }}>{o.amount}</td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}` }}><StatusPill status={o.status} /></td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, fontSize: 12, color: T.muted, whiteSpace: "nowrap" }}>{o.time}</td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}` }}>
                  <button style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 5, padding: "3px 10px", fontSize: 11.5, cursor: "pointer", color: T.slate, fontWeight: 500 }}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14 }}>
          <div style={{ fontSize: 12, color: T.muted }}>Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} orders</div>
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ width: 28, height: 28, border: `1px solid ${T.border}`, borderRadius: 4, background: T.card, cursor: "pointer", fontSize: 13 }}>‹</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)} style={{ width: 28, height: 28, border: `1px solid ${page === n ? T.blue : T.border}`, borderRadius: 4, background: page === n ? T.blue : T.card, color: page === n ? "#fff" : T.text, cursor: "pointer", fontSize: 12, fontWeight: page === n ? 600 : 400 }}>{n}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ width: 28, height: 28, border: `1px solid ${T.border}`, borderRadius: 4, background: T.card, cursor: "pointer", fontSize: 13 }}>›</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RESTAURANTS PAGE ─────────────────────────────────────────────
function RestaurantsPage() {
  const [view, setView] = useState("brands");
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.navy, letterSpacing: "-0.4px" }}>Restaurants & Outlets</div>
          <div style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>4 restaurant brands · 24 active outlets · 8 cities</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ display: "flex", gap: 2, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: 3 }}>
            {["brands","outlets"].map(v => (
              <span key={v} onClick={() => setView(v)} style={{ padding: "4px 12px", borderRadius: 4, fontSize: 12, cursor: "pointer", fontWeight: 500, background: view === v ? T.card : "transparent", color: view === v ? T.navy : T.muted, textTransform: "capitalize" }}>{v}</span>
            ))}
          </div>
          <button style={{ background: T.blue, color: "#fff", border: "none", borderRadius: 6, padding: "0 14px", height: 32, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ Add Restaurant</button>
        </div>
      </div>

      {view === "brands" ? (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 20 }}>
            {restaurants.map((r, i) => (
              <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>
                <div style={{ height: 72, background: `linear-gradient(135deg, ${r.color} 0%, ${r.color}cc 100%)`, display: "flex", alignItems: "center", padding: "0 20px", gap: 14 }}>
                  <span style={{ fontSize: 32 }}>{r.icon}</span>
                  <div>
                    <div style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>{r.name}</div>
                    <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11.5 }}>{r.cat} · {r.cities}</div>
                  </div>
                  <div style={{ marginLeft: "auto" }}><StatusPill status={r.status} /></div>
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 14 }}>
                    {[
                      { label: "Revenue", value: r.rev },
                      { label: "Orders", value: r.orders.toLocaleString() },
                      { label: "Outlets", value: r.outlets },
                      { label: "Rating", value: r.rating.toFixed(1) + " ★" },
                    ].map(s => (
                      <div key={s.label} style={{ background: T.bg, borderRadius: 6, padding: "8px 10px" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: T.navy }}>{s.value}</div>
                        <div style={{ fontSize: 10.5, color: T.muted }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={{ flex: 1, height: 30, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12, color: T.slate, cursor: "pointer", fontWeight: 500 }}>View Outlets</button>
                    <button style={{ flex: 1, height: 30, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12, color: T.slate, cursor: "pointer", fontWeight: 500 }}>Edit Menu</button>
                    <button style={{ width: 30, height: 30, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 14, cursor: "pointer" }}>⋮</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Outlet table */}
          <SectionCard title="All Outlets" action="+ Add Outlet">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: T.bg }}>
                  {["Outlet Name","Brand","City","Revenue","Orders","Rating","Integrations","Status",""].map(h => (
                    <th key={h} style={{ fontSize: 11, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: "0.4px", padding: "8px 12px", textAlign: "left", borderBottom: `1px solid ${T.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {outletPerf.map((o, i) => (
                  <tr key={i} onMouseEnter={e => e.currentTarget.style.background = T.bg} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, fontWeight: 600, color: T.navy, fontSize: 12.5 }}>{o.name}</td>
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, fontSize: 12, color: T.muted }}>Burger Nation</td>
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, fontSize: 12, color: T.slate }}>{o.city}</td>
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, fontWeight: 700, color: T.navy }}>{o.rev}</td>
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, fontSize: 12.5, color: T.slate }}>{o.orders.toLocaleString()}</td>
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}` }}><Stars rating={o.rating} /></td>
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}` }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        {["SW","ZO","OA"].map(p => <span key={p} style={{ fontSize: 10, padding: "1px 5px", borderRadius: 4, background: T.bg, border: `1px solid ${T.border}`, color: T.muted, fontWeight: 600 }}>{p}</span>)}
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}` }}><StatusPill status={o.status} /></td>
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}` }}>
                      <button style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 5, padding: "3px 10px", fontSize: 11.5, cursor: "pointer", color: T.slate, fontWeight: 500 }}>Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
        </>
      ) : (
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 16 }}>
          <p style={{ color: T.muted, fontSize: 13 }}>Outlets map view — switch to "brands" to see the card grid.</p>
        </div>
      )}
    </div>
  );
}

// ─── INVENTORY PAGE ───────────────────────────────────────────────
function InventoryPage() {
  const cats = ["All Items","Proteins","Breads & Wraps","Vegetables","Dairy","Beverages","Condiments"];
  const [cat, setCat] = useState("All Items");
  const filtered = cat === "All Items" ? inventory : inventory.filter(i => i.cat === cat || (cat === "Breads & Wraps" && i.cat === "Breads"));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.navy, letterSpacing: "-0.4px" }}>Inventory Management</div>
          <div style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>7 critical alerts · Last synced 4 min ago</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ height: 32, background: T.card, border: `1px solid ${T.border}`, borderRadius: 6, padding: "0 12px", fontSize: 12, color: T.slate, cursor: "pointer", fontWeight: 500 }}>↑ Import Stock</button>
          <button style={{ height: 32, background: T.blue, border: "none", borderRadius: 6, padding: "0 14px", fontSize: 12, color: "#fff", cursor: "pointer", fontWeight: 600 }}>+ Add Item</button>
        </div>
      </div>

      {/* Alert summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        <div style={{ background: T.errorLight, border: `1px solid ${T.error}33`, borderRadius: 8, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>🚨</span>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: T.error }}>{inventory.filter(i => i.alert === "critical").length}</div>
            <div style={{ fontSize: 12, color: T.error, fontWeight: 500 }}>Critical — Order immediately</div>
          </div>
        </div>
        <div style={{ background: T.warningLight, border: `1px solid ${T.warning}33`, borderRadius: 8, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: T.warning }}>{inventory.filter(i => i.alert === "low").length}</div>
            <div style={{ fontSize: 12, color: T.warning, fontWeight: 500 }}>Low — Restock soon</div>
          </div>
        </div>
        <div style={{ background: T.successLight, border: `1px solid ${T.success}33`, borderRadius: 8, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>✅</span>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: T.success }}>{inventory.filter(i => i.alert === "ok").length}</div>
            <div style={{ fontSize: 12, color: T.success, fontWeight: 500 }}>Adequate stock</div>
          </div>
        </div>
      </div>

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 16 }}>
        {/* Category filter */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {cats.map(c => (
            <span key={c} onClick={() => setCat(c)} style={{ padding: "4px 13px", borderRadius: 20, fontSize: 11.5, fontWeight: 500, border: `1px solid ${cat === c ? T.navy : T.border}`, cursor: "pointer", color: cat === c ? "#fff" : T.muted, background: cat === c ? T.navy : T.card, transition: "all 0.1s" }}>{c}</span>
          ))}
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: T.bg }}>
              {["Item Name","Category","Current Qty","Threshold","Stock Level","Alert Status","Outlet","Last Updated",""].map(h => (
                <th key={h} style={{ fontSize: 11, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: "0.4px", padding: "8px 12px", textAlign: "left", borderBottom: `1px solid ${T.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <tr key={i} onMouseEnter={e => e.currentTarget.style.background = T.bg} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, fontWeight: 600, color: T.navy, fontSize: 12.5 }}>{item.name}</td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, fontSize: 12, color: T.muted }}>{item.cat}</td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, fontWeight: 700, fontSize: 13, color: item.alert === "critical" ? T.error : item.alert === "low" ? T.warning : T.navy }}>{item.qty}</td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, fontSize: 12.5, color: T.muted }}>{item.threshold}</td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 80, height: 6, background: T.border, borderRadius: 3 }}>
                      <div style={{ width: `${item.pct}%`, height: 6, background: item.alert === "critical" ? T.error : item.alert === "low" ? T.warning : T.success, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 11, color: T.muted }}>{item.pct}%</span>
                  </div>
                </td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ fontSize: 11.5, padding: "2px 9px", borderRadius: 20, fontWeight: 500, background: item.alert === "critical" ? T.errorLight : item.alert === "low" ? T.warningLight : T.successLight, color: item.alert === "critical" ? T.error : item.alert === "low" ? T.warning : T.success }}>
                    {item.alert === "critical" ? "🔴 Critical" : item.alert === "low" ? "🟡 Low" : "🟢 OK"}
                  </span>
                </td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, fontSize: 12, color: T.muted }}>Connaught Pl.</td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, fontSize: 12, color: T.muted }}>{item.updated}</td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}` }}>
                  <button style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 5, padding: "3px 10px", fontSize: 11.5, cursor: "pointer", color: T.slate, fontWeight: 500 }}>Restock</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── ANALYTICS PAGE ───────────────────────────────────────────────
function AnalyticsPage() {
  const [revPeriod, setRevPeriod] = useState("monthly");

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.navy, letterSpacing: "-0.4px" }}>Analytics</div>
          <div style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>June 2026 · Burger Nation Group · All outlets</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select style={{ height: 32, background: T.card, border: `1px solid ${T.border}`, borderRadius: 6, padding: "0 10px", fontSize: 12, color: T.text, outline: "none" }}>
            <option>Last 6 months</option><option>Last 30 days</option><option>Last 7 days</option><option>Custom</option>
          </select>
          <button style={{ height: 32, background: T.card, border: `1px solid ${T.border}`, borderRadius: 6, padding: "0 12px", fontSize: 12, color: T.slate, cursor: "pointer" }}>↓ Export Report</button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Revenue (MTD)", value: "₹48.2L", badge: "+12.4%", up: true },
          { label: "Orders (MTD)", value: "18,294", badge: "+8.1%", up: true },
          { label: "New Customers", value: "3,841", badge: "+22.3%", up: true },
          { label: "Avg Order Value", value: "₹263", badge: "-1.8%", up: false },
          { label: "Cancelled Rate", value: "2.4%", badge: "-0.3%", up: true },
        ].map((k, i) => (
          <KpiCard key={i} label={k.label} value={k.value} badge={k.badge} badgeUp={k.up} />
        ))}
      </div>

      {/* Revenue + Orders trend */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <SectionCard
          title="Revenue Trend"
          extra={
            <div style={{ display: "flex", gap: 2, background: T.bg, borderRadius: 6, padding: 3 }}>
              {["monthly","quarterly"].map(p => (
                <span key={p} onClick={() => setRevPeriod(p)} style={{ padding: "3px 9px", borderRadius: 4, cursor: "pointer", fontSize: 11.5, fontWeight: 500, background: revPeriod === p ? T.card : "transparent", color: revPeriod === p ? T.navy : T.muted, textTransform: "capitalize" }}>{p}</span>
              ))}
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueMonthly}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={T.blue} stopOpacity={0.12} />
                  <stop offset="95%" stopColor={T.blue} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="prevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#94A3B8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: T.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: T.muted }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}L`} />
              <Tooltip contentStyle={customTooltipStyle} formatter={(v, n) => [`₹${v}L`, n === "v" ? "This year" : "Last year"]} />
              <Area type="monotone" dataKey="prev" stroke="#CBD5E1" strokeWidth={1.5} fill="url(#prevGrad)" strokeDasharray="4 3" dot={false} />
              <Area type="monotone" dataKey="v" stroke={T.blue} strokeWidth={2} fill="url(#revGrad)" dot={{ fill: T.blue, r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: T.muted }}><span style={{ width: 16, height: 2, background: T.blue, display: "inline-block", borderRadius: 1 }} /> This year</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: T.muted }}><span style={{ width: 16, height: 2, background: "#CBD5E1", display: "inline-block", borderRadius: 1, borderTop: "2px dashed #CBD5E1" }} /> Last year</span>
          </div>
        </SectionCard>

        <SectionCard title="Customer Growth">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={customerGrowth} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: T.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: T.muted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={customTooltipStyle} formatter={(v, n) => [v.toLocaleString(), n === "new" ? "New" : "Returning"]} />
              <Bar dataKey="ret" stackId="a" fill="#BFDBFE" radius={[0,0,0,0]} />
              <Bar dataKey="new" stackId="a" fill={T.blue} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: T.muted }}><span style={{ width: 10, height: 10, background: T.blue, display: "inline-block", borderRadius: 2 }} /> New</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: T.muted }}><span style={{ width: 10, height: 10, background: "#BFDBFE", display: "inline-block", borderRadius: 2 }} /> Returning</span>
          </div>
        </SectionCard>
      </div>

      {/* Platform + Hourly */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 12, marginBottom: 20 }}>
        <SectionCard title="Platform Split">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={platformSplit} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="value" paddingAngle={3}>
                {platformSplit.map((p, i) => <Cell key={i} fill={p.color} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v}%`, n]} contentStyle={customTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          {platformSplit.map(p => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${T.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 9, height: 9, borderRadius: 2, background: p.color, display: "inline-block" }} />
                <span style={{ fontSize: 12.5, color: T.navy, fontWeight: 500 }}>{p.name}</span>
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: T.navy }}>{p.value}%</span>
            </div>
          ))}
        </SectionCard>

        <SectionCard title="Order Volume by Hour" extra={<span style={{ fontSize: 11, color: T.muted }}>Today</span>}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hourlyOrders} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="h" tick={{ fontSize: 10, fill: T.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: T.muted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={customTooltipStyle} formatter={v => [v, "Orders"]} />
              <Bar dataKey="v" fill={T.blue} radius={[3,3,0,0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Category Performance */}
      <SectionCard title="Category Performance" extra={<span style={{ fontSize: 11, color: T.muted }}>June 2026 · All outlets</span>}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: T.bg }}>
              {["Category","Orders","Revenue","Avg Order Value","% of Total","MoM Trend",""].map(h => (
                <th key={h} style={{ fontSize: 11, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: "0.4px", padding: "8px 12px", textAlign: "left", borderBottom: `1px solid ${T.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categoryPerf.map((c, i) => (
              <tr key={i} onMouseEnter={e => e.currentTarget.style.background = T.bg} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, fontWeight: 600, color: T.navy, fontSize: 12.5 }}>{c.cat}</td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, fontSize: 12.5, color: T.slate }}>{c.orders.toLocaleString()}</td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, fontWeight: 700, color: T.navy }}>{c.rev}</td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, fontSize: 12.5, color: T.slate }}>{c.aov}</td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 5, background: T.border, borderRadius: 2 }}>
                      <div style={{ width: `${c.pct}%`, height: 5, background: T.blue, borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 11.5, color: T.muted, minWidth: 28 }}>{c.pct}%</span>
                  </div>
                </td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ background: c.trend > 0 ? T.successLight : T.errorLight, color: c.trend > 0 ? T.success : T.error, padding: "2px 8px", borderRadius: 20, fontSize: 11.5, fontWeight: 500 }}>
                    {c.trend > 0 ? "▲" : "▼"} {Math.abs(c.trend)}%
                  </span>
                </td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}` }}>
                  <button style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 5, padding: "3px 10px", fontSize: 11.5, cursor: "pointer", color: T.slate }}>Drill down</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}

// ─── SIDEBAR + TOPBAR ─────────────────────────────────────────────
const navSections = [
  { label: "Overview", items: [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "restaurants", icon: "🏪", label: "Restaurants" },
    { id: "restaurants", icon: "📍", label: "Outlets" },
  ]},
  { label: "Commerce", items: [
    { id: "orders", icon: "🧾", label: "Orders", badge: 24 },
    { id: "dashboard", icon: "🍽", label: "Menu" },
    { id: "inventory", icon: "📦", label: "Inventory", badge: 7, badgeColor: T.error },
    { id: "dashboard", icon: "👥", label: "Customers" },
  ]},
  { label: "Intelligence", items: [
    { id: "analytics", icon: "📈", label: "Analytics" },
    { id: "dashboard", icon: "🔌", label: "Integrations" },
    { id: "dashboard", icon: "🔔", label: "Notifications" },
    { id: "dashboard", icon: "⚙️", label: "Settings" },
  ]},
];

export default function FoodMesh() {
  const [activePage, setActivePage] = useState("dashboard");

  const pages = {
    dashboard: <DashboardPage />,
    orders: <OrdersPage />,
    restaurants: <RestaurantsPage />,
    inventory: <InventoryPage />,
    analytics: <AnalyticsPage />,
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontSize: 13, background: T.bg, color: T.text }}>
      {/* SIDEBAR */}
      <nav style={{ width: 220, background: T.navy, display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto" }}>
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 28, height: 28, background: T.blue, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🕸</div>
            <div>
              <div style={{ color: "#fff", fontSize: 15, fontWeight: 700, letterSpacing: "-0.3px" }}>FoodMesh</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.5px", textTransform: "uppercase" }}>Commerce Infrastructure</div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, padding: "8px 0" }}>
          {navSections.map(section => (
            <div key={section.label} style={{ padding: "8px 8px 4px" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.28)", letterSpacing: "0.8px", textTransform: "uppercase", padding: "0 8px", marginBottom: 4 }}>{section.label}</div>
              {section.items.map((item, i) => (
                <div key={i} onClick={() => setActivePage(item.id)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 9px", borderRadius: 6, cursor: "pointer", color: activePage === item.id && item.id === section.items[i]?.id ? "#fff" : "rgba(255,255,255,0.55)", background: activePage === item.id ? "rgba(37,99,235,0.18)" : "transparent", fontWeight: activePage === item.id ? 500 : 400, fontSize: 12.5, transition: "all 0.1s", marginBottom: 1 }}
                  onMouseEnter={e => { if (activePage !== item.id) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                  onMouseLeave={e => { if (activePage !== item.id) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ fontSize: 14, width: 16, textAlign: "center" }}>{item.icon}</span>
                  {item.label}
                  {item.badge && (
                    <span style={{ marginLeft: "auto", background: item.badgeColor || T.blue, color: "#fff", fontSize: 10, padding: "1px 6px", borderRadius: 10, fontWeight: 600 }}>{item.badge}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 9px", borderRadius: 6, cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1D4ED8", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>AK</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 500 }}>Arjun Kapoor</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10.5 }}>Super Admin</div>
            </div>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>⋮</span>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* TOPBAR */}
        <header style={{ background: T.card, borderBottom: `1px solid ${T.border}`, padding: "0 24px", height: 52, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "0 10px", height: 32, flex: "0 0 260px" }}>
            <span style={{ color: T.muted, fontSize: 13 }}>🔍</span>
            <input placeholder="Search orders, outlets, customers..." style={{ border: "none", background: "transparent", outline: "none", fontSize: 12.5, color: T.text, flex: 1 }} />
            <span style={{ fontSize: 11, color: T.muted, background: T.border, padding: "1px 5px", borderRadius: 3 }}>⌘K</span>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "0 10px", height: 32, cursor: "pointer", fontSize: 12, fontWeight: 500, color: T.text }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.success, display: "inline-block" }} />
              Burger Nation Group
              <span style={{ color: T.muted, fontSize: 11 }}>▾</span>
            </div>
            <div style={{ position: "relative", width: 32, height: 32, borderRadius: 6, border: `1px solid ${T.border}`, background: T.card, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>
              🔔
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.error, position: "absolute", top: 5, right: 5, display: "block" }} />
            </div>
            <div style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${T.border}`, background: T.card, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>❓</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, background: T.blue, color: "#fff", borderRadius: 6, padding: "0 13px", height: 32, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              + Quick Action
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {pages[activePage]}
        </main>
      </div>
    </div>
  );
}