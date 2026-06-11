import { ShoppingBag, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function OrderSummaryCards() {
  const stats = [
    { label: "Active Orders", value: "14", change: "+12%", up: true, icon: ShoppingBag, color: "var(--accent)" },
    { label: "Avg Prep Time", value: "18 mins", change: "-4%", up: false, icon: Clock, color: "var(--green)" },
    { label: "Ready to Serve", value: "5", change: "+2", up: true, icon: CheckCircle2, color: "var(--amber)" },
    { label: "Cancellations", value: "2", change: "0%", up: null, icon: AlertCircle, color: "var(--red)" }
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
              {s.change} vs last period
            </div>
          </div>
        );
      })}
    </div>
  );
}
