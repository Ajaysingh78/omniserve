import { useState } from "react";
import OrderSummaryCards from "../component/OrderSummaryCards";
import OrdersTable from "../component/OrdersTable";
import OrderDetailsDrawer from "../component/OrderDetailsDrawer";
import { INITIAL_ORDERS } from "../../../data/data";

// Flat array of initial orders
const allInitialOrders = [
  ...INITIAL_ORDERS.new,
  ...INITIAL_ORDERS.accepted,
  ...INITIAL_ORDERS.preparing,
  ...INITIAL_ORDERS.ready,
  ...INITIAL_ORDERS.completed,
  ...INITIAL_ORDERS.cancelled
];

export default function OrderPage() {
  const [orders] = useState(allInitialOrders);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filter orders based on active tab and search criteria
  const filteredOrders = orders.filter((o) => {
    // Filter by tab status
    if (activeTab === "live" && (o.col === "completed" || o.col === "cancelled")) return false;
    if (activeTab === "pending" && o.col !== "new") return false;
    if (activeTab === "completed" && o.col !== "completed") return false;
    
    // Filter by search string
    if (search.trim() !== "") {
      const matchSearch = 
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.name.toLowerCase().includes(search.toLowerCase()) ||
        o.ch.toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;
    }

    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div className="page-header">
        <div className="header-row">
          <div>
            <div className="page-title">Order Directory</div>
            <div className="page-sub">Browse, manage, and process all online and offline store transactions.</div>
          </div>
          <div className="header-actions">
            <button className="btn">Export CSV</button>
            <input 
              type="text" 
              placeholder="Search ID, customer, channel…" 
              className="btn"
              style={{ background: "var(--bg3)", color: "var(--text)", padding: "7px 12px", width: 220, outline: "none", border: "1px solid var(--border)" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <OrderSummaryCards />

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 0 }}>
        {[
          { key: "all",       label: "All Transactions" },
          { key: "live",      label: "Active Orders" },
          { key: "pending",   label: "Pending Action" },
          { key: "completed", label: "Completed" },
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

      {/* Orders Table */}
      <OrdersTable orders={filteredOrders} onSelectOrder={setSelectedOrder} />

      {/* Details Drawer */}
      {selectedOrder && (
        <OrderDetailsDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
