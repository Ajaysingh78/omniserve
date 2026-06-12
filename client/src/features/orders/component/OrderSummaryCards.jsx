import { ShoppingBag, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function OrderSummaryCards({ orders = [] }) {
  const activeOrders = orders.filter(o => o.orderStatus !== "DELIVERED" && o.orderStatus !== "COMPLETED" && o.orderStatus !== "CANCELLED").length;
  const readyOrders = orders.filter(o => o.orderStatus === "READY").length;
  const cancelledOrders = orders.filter(o => o.orderStatus === "CANCELLED").length;
  
  // Calculate average prep time from ready/delivered orders
  let avgPrepTimeStr = "18 mins"; // sensible default
  const prepTimes = orders
    .filter(o => o.preparedAt && o.acceptedAt)
    .map(o => (new Date(o.preparedAt).getTime() - new Date(o.acceptedAt).getTime()) / 60000);
  if (prepTimes.length > 0) {
    const avg = Math.round(prepTimes.reduce((sum, val) => sum + val, 0) / prepTimes.length);
    avgPrepTimeStr = `${avg} mins`;
  }

  const stats = [
    { label: "Active Orders", value: activeOrders.toString(), change: `Live`, up: activeOrders > 0, icon: ShoppingBag, color: "var(--accent)" },
    { label: "Avg Prep Time", value: avgPrepTimeStr, change: "SLA OK", up: false, icon: Clock, color: "var(--green)" },
    { label: "Ready to Serve", value: readyOrders.toString(), change: `Pickup ready`, up: readyOrders > 0, icon: CheckCircle2, color: "var(--amber)" },
    { label: "Cancellations", value: cancelledOrders.toString(), change: "Today", up: null, icon: AlertCircle, color: "var(--red)" }
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div key={idx} className="kpi-card" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="kpi-label" style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase" }}>{s.label}</span>
              <Icon size={18} color={s.color} />
            </div>
            <div className="kpi-value" style={{ fontSize: 24, fontWeight: 700, margin: "6px 0", color: "var(--text)" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: s.up === true ? "var(--green)" : s.up === false ? "var(--red)" : "var(--text3)" }}>
              {s.change}
            </div>
          </div>
        );
      })}
    </div>
  );
}
