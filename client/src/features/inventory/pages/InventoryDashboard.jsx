import StockTable from "../components/StockTable";

export default function InventoryDashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div className="page-header">
        <div className="header-row">
          <div>
            <div className="page-title">Store Inventory Control</div>
            <div className="page-sub">Monitor ingredients level, Safety stocks, stock alerts, and procurement requisitions.</div>
          </div>
        </div>
      </div>

      {/* Safety metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { label: "Total Valuation", value: "₹42,800", sub: "72 items tracked", color: "var(--accent)" },
          { label: "Critical Stock Items", value: "1", sub: "Immediate action required", color: "var(--red)" },
          { label: "Low Stock Items", value: "2", sub: "Recommended procurement", color: "var(--amber)" },
          { label: "Safety Health", value: "92%", sub: "Average safety compliance", color: "var(--green)" }
        ].map((c, idx) => (
          <div key={idx} className="kpi-card">
            <span className="kpi-label" style={{ display: "block", color: "var(--text3)", fontSize: 10.5 }}>{c.label}</span>
            <span style={{ display: "block", fontSize: 24, fontWeight: 700, margin: "6px 0", color: c.color }}>{c.value}</span>
            <span style={{ fontSize: 11, color: "var(--text2)" }}>{c.sub}</span>
          </div>
        ))}
      </div>

      {/* Stock Warnings Banner */}
      <div style={{ background: "#ef444415", border: "1px solid #ef444440", borderRadius: 10, padding: "12px 16px", display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ fontSize: 20 }}>⚠</span>
        <div style={{ fontSize: 12.5, color: "var(--red)" }}>
          <strong>Inventory Alert:</strong> Raw ingredient <strong>Amul Butter Blocks (SKU-BT400)</strong> is critical (2 kg remaining, Safety threshold is 8 kg). Please place a procurement order.
        </div>
      </div>

      {/* Stock Table Component */}
      <StockTable />
    </div>
  );
}
