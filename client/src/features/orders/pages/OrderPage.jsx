import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import OrderSummaryCards from "../component/OrderSummaryCards";
import OrdersTable from "../component/OrdersTable";
import OrderDetailsDrawer from "../component/OrderDetailsDrawer";
import axiosInstance from "@/services/axios";
import toast from "react-hot-toast";

export default function OrderPage() {
  const selectedOutlet = useSelector((state) => state.auth.selectedOutlet);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!selectedOutlet) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/orders?outletId=${selectedOutlet.id}&limit=100`);
      if (res.data && res.data.data && res.data.data.orders) {
        setOrders(res.data.data.orders);
      }
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  }, [selectedOutlet]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSelectOrder = async (orderSummary) => {
    const loadingToast = toast.loading("Loading order details...");
    try {
      const res = await axiosInstance.get(`/orders/${orderSummary.id}`);
      toast.dismiss(loadingToast);
      if (res.data && res.data.data) {
        setSelectedOrder(res.data.data);
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error(err);
      toast.error("Failed to load order details");
    }
  };

  // Filter orders based on active tab and search criteria
  const filteredOrders = orders.filter((o) => {
    // Filter by tab status
    const isLive = o.orderStatus !== "DELIVERED" && o.orderStatus !== "COMPLETED" && o.orderStatus !== "CANCELLED";
    const isPending = o.orderStatus === "PENDING";
    const isCompleted = o.orderStatus === "DELIVERED" || o.orderStatus === "COMPLETED";

    if (activeTab === "live" && !isLive) return false;
    if (activeTab === "pending" && !isPending) return false;
    if (activeTab === "completed" && !isCompleted) return false;
    
    // Filter by search string
    if (search.trim() !== "") {
      const customerName = o.customerId 
        ? `${o.customerId.firstName} ${o.customerId.lastName || ""}`
        : "Walk-in Customer";
      const matchSearch = 
        (o.orderNumber || "").toLowerCase().includes(search.toLowerCase()) ||
        customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.source.toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;
    }

    return true;
  });

  if (!selectedOutlet) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "calc(100vh - 92px)", color: "var(--text3)", gap: 10 }}>
        <div style={{ fontSize: 32 }}>🏪</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>No Active Outlet Selected</div>
        <div style={{ fontSize: 13, maxWidth: 300, textAlign: "center" }}>Please select an active outlet from the header dropdown to view orders.</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div className="page-header">
        <div className="header-row">
          <div>
            <div className="page-title">Order Directory</div>
            <div className="page-sub">Browse, manage, and process all online and offline transactions for {selectedOutlet.name}.</div>
          </div>
          <div className="header-actions">
            <button className="btn" onClick={fetchOrders}>Refresh List</button>
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
      <OrderSummaryCards orders={orders} />

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
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>Loading store orders...</div>
      ) : (
        <OrdersTable orders={filteredOrders} onSelectOrder={handleSelectOrder} />
      )}

      {/* Details Drawer */}
      {selectedOrder && (
        <OrderDetailsDrawer 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
          onRefresh={fetchOrders}
        />
      )}
    </div>
  );
}
