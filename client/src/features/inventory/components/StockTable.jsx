import { useState } from "react";
import toast from "react-hot-toast";

const initialStockItems = [
  { sku: "SKU-PN100", name: "Paneer Blocks (Fresh)", category: "Dairy", stock: 15, unit: "kg", minThreshold: 10, status: "Normal" },
  { sku: "SKU-CH200", name: "Chicken Breasts (Boneless)", category: "Meat", stock: 8, unit: "kg", minThreshold: 15, status: "Low Stock" },
  { sku: "SKU-DN300", name: "Naan Dough Batches", category: "Bakery", stock: 65, unit: "batches", minThreshold: 30, status: "Normal" },
  { sku: "SKU-BT400", name: "Amul Butter Blocks", category: "Dairy", stock: 2, unit: "kg", minThreshold: 8, status: "Critical" },
  { sku: "SKU-TM500", name: "Tomato Puree Cans", category: "Produce", stock: 14, unit: "cans", minThreshold: 10, status: "Normal" },
  { sku: "SKU-ON600", name: "Red Onions Bag", category: "Produce", stock: 4, unit: "bags", minThreshold: 5, status: "Low Stock" },
  { sku: "SKU-SP700", name: "Desi Ghee Jar", category: "Groceries", stock: 11, unit: "litres", minThreshold: 4, status: "Normal" },
];

export default function StockTable() {
  const [stockItems, setStockItems] = useState(initialStockItems);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const handleUpdateStock = (sku, change) => {
    setStockItems(prev => 
      prev.map(item => {
        if (item.sku === sku) {
          const nextStock = Math.max(0, item.stock + change);
          let nextStatus = "Normal";
          if (nextStock <= item.minThreshold / 2) {
            nextStatus = "Critical";
          } else if (nextStock <= item.minThreshold) {
            nextStatus = "Low Stock";
          }
          return { ...item, stock: nextStock, status: nextStatus };
        }
        return item;
      })
    );
    toast.success("Stock level adjusted!");
  };

  const filtered = stockItems.filter(item => {
    if (filterStatus !== "All" && item.status !== filterStatus) return false;
    return item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
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
          placeholder="Search SKU or ingredient…" 
          className="btn"
          style={{ background: "var(--bg3)", color: "var(--text)", padding: "7px 12px", width: 200, outline: "none", border: "1px solid var(--border)" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
        <table className="st-table">
          <thead>
            <tr>
              <th>SKU Code</th>
              <th>Ingredient Name</th>
              <th>Category</th>
              <th>Safety Threshold</th>
              <th>Current Stock</th>
              <th>Status</th>
              <th>Adjust Level</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const statusClass = 
                item.status === "Critical" ? "badge-red" : 
                item.status === "Low Stock" ? "badge-amber" : 
                "badge-green";

              return (
                <tr key={item.sku}>
                  <td style={{ fontWeight: 700 }}>{item.sku}</td>
                  <td style={{ fontWeight: 600 }}>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.minThreshold} {item.unit}</td>
                  <td style={{ fontWeight: 700 }}>{item.stock} {item.unit}</td>
                  <td>
                    <span className={`badge ${statusClass}`}>{item.status}</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <button className="adjust-btn" onClick={() => handleUpdateStock(item.sku, -1)}>-</button>
                      <button className="adjust-btn" onClick={() => handleUpdateStock(item.sku, 5)}>+</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
