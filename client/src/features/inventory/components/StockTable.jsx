import { useState } from "react";

export default function StockTable({ stockItems = [], onAdjustStock, loading = false }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const getStatus = (item) => {
    if (item.quantity <= item.threshold / 2) return "Critical";
    if (item.isLowStock) return "Low Stock";
    return "Normal";
  };

  const filtered = stockItems.filter(item => {
    const status = getStatus(item);
    if (filterStatus !== "All" && status !== filterStatus) return false;
    
    const itemName = item.menuItemId?.name || "";
    const itemSku = item.menuItemId?.sku || "";
    return itemName.toLowerCase().includes(search.toLowerCase()) || itemSku.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <style>{`
        .filter-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .st-table { width: 100%; border-collapse: collapse; text-align: left; }
        .st-table th, .st-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); }
        .st-table th { background: var(--bg3); color: var(--text2); font-size: 11px; text-transform: uppercase; font-weight: 600; }
        .st-table td { color: var(--text); }
        .adjust-btn { width: 24px; height: 24px; border-radius: 4px; border: 1px solid var(--border); background: var(--bg4); color: var(--text); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
        .adjust-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div className="filter-row">
        <div style={{ display: "flex", gap: 6 }}>
          {["All", "Normal", "Low Stock", "Critical"].map(s => (
            <button 
              key={s} 
              className={`btn${filterStatus === s ? " primary" : ""}`}
              onClick={() => setFilterStatus(s)}
              style={{ fontSize: 11, padding: "5px 10px" }}
            >
              {s}
            </button>
          ))}
        </div>

        <input 
          type="text" 
          placeholder="Search SKU or item…" 
          className="btn"
          style={{ background: "var(--bg3)", color: "var(--text)", padding: "7px 12px", width: 200, outline: "none", border: "1px solid var(--border)" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, overflowX: "auto" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>Loading stock levels...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>No matching inventory items found</div>
        ) : (
          <table className="st-table">
            <thead>
              <tr>
                <th>SKU Code</th>
                <th>Item Name</th>
                <th>Retail Price</th>
                <th>Safety Threshold</th>
                <th>Current Stock</th>
                <th>Status</th>
                <th>Adjust Level</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const status = getStatus(item);
                const statusClass = 
                  status === "Critical" ? "badge-red" : 
                  status === "Low Stock" ? "badge-amber" : 
                  "badge-green";

                return (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 700 }}>{item.menuItemId?.sku || "N/A"}</td>
                    <td style={{ fontWeight: 600 }}>{item.menuItemId?.name || "N/A"}</td>
                    <td>₹{item.menuItemId?.price || 0}</td>
                    <td>{item.threshold} units</td>
                    <td style={{ fontWeight: 700 }}>{item.quantity} units</td>
                    <td>
                      <span className={`badge ${statusClass}`}>{status}</span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <button 
                          className="adjust-btn" 
                          onClick={() => onAdjustStock(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 0}
                        >-</button>
                        <button 
                          className="adjust-btn" 
                          onClick={() => onAdjustStock(item.id, item.quantity + 5)}
                        >+</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
