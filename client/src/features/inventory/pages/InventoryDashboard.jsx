import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import StockTable from "../components/StockTable";
import axiosInstance from "@/services/axios";
import toast from "react-hot-toast";

export default function InventoryDashboard() {
  const selectedOutlet = useSelector((state) => state.auth.selectedOutlet);

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInventory = useCallback(async () => {
    if (!selectedOutlet) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/inventory?outletId=${selectedOutlet.id}&limit=100`);
      if (res.data && res.data.data && res.data.data.inventory) {
        setInventory(res.data.data.inventory);
      }
    } catch (err) {
      console.error("Failed to load store inventory", err);
    } finally {
      setLoading(false);
    }
  }, [selectedOutlet]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleAdjustStock = async (id, newQty) => {
    const loadingToast = toast.loading("Adjusting stock level...");
    try {
      await axiosInstance.patch(`/inventory/${id}/quantity`, {
        quantity: newQty,
      });
      toast.dismiss(loadingToast);
      toast.success("Stock level updated!");
      fetchInventory();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to adjust stock");
    }
  };

  // Math metrics
  const totalValuation = inventory.reduce(
    (sum, item) => sum + item.quantity * (item.menuItemId?.price || 0),
    0
  );
  
  const criticalItems = inventory.filter(
    (item) => item.quantity <= item.threshold / 2
  );
  
  const lowStockItems = inventory.filter(
    (item) => item.isLowStock && item.quantity > item.threshold / 2
  );

  const totalItemsCount = inventory.length || 1;
  const safetyHealthCompliance = Math.round(
    ((inventory.length - (criticalItems.length + lowStockItems.length)) / totalItemsCount) * 100
  );

  if (!selectedOutlet) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "calc(100vh - 92px)", color: "var(--text3)", gap: 10 }}>
        <div style={{ fontSize: 32 }}>🏪</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>No Active Outlet Selected</div>
        <div style={{ fontSize: 13, maxWidth: 300, textAlign: "center" }}>Please select an active outlet from the header dropdown to view stock items.</div>
      </div>
    );
  }

  // Find the most critical item to highlight in the banner
  const highlightItem = criticalItems.length > 0 
    ? criticalItems[0] 
    : (lowStockItems.length > 0 ? lowStockItems[0] : null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div className="page-header">
        <div className="header-row">
          <div>
            <div className="page-title">Store Inventory Control</div>
            <div className="page-sub">Monitor ingredients level, Safety stocks, stock alerts, and procurement requisitions for {selectedOutlet.name}.</div>
          </div>
        </div>
      </div>

      {/* Safety metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { label: "Valuation of Stock", value: `₹${totalValuation.toLocaleString()}`, sub: `${inventory.length} catalog items`, color: "var(--accent)" },
          { label: "Critical Stock Items", value: criticalItems.length.toString(), sub: "Needs urgent adjustment", color: "var(--red)" },
          { label: "Low Stock Items", value: lowStockItems.length.toString(), sub: "Recommended procurement", color: "var(--amber)" },
          { label: "Safety Compliance", value: `${safetyHealthCompliance}%`, sub: "Above safety threshold", color: "var(--green)" }
        ].map((c, idx) => (
          <div key={idx} className="kpi-card">
            <span className="kpi-label" style={{ display: "block", color: "var(--text3)", fontSize: 10.5 }}>{c.label}</span>
            <span style={{ display: "block", fontSize: 24, fontWeight: 700, margin: "6px 0", color: c.color }}>{c.value}</span>
            <span style={{ fontSize: 11, color: "var(--text2)" }}>{c.sub}</span>
          </div>
        ))}
      </div>

      {/* Stock Warnings Banner */}
      {highlightItem ? (
        <div style={{ background: "#ef444415", border: "1px solid #ef444440", borderRadius: 10, padding: "12px 16px", display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 20 }}>⚠</span>
          <div style={{ fontSize: 12.5, color: "var(--red)" }}>
            <strong>Inventory Alert:</strong> Menu item <strong>{highlightItem.menuItemId?.name} (SKU: {highlightItem.menuItemId?.sku || "N/A"})</strong> is running low ({highlightItem.quantity} units remaining, Safety threshold is {highlightItem.threshold} units). Please replenish stock.
          </div>
        </div>
      ) : (
        <div style={{ background: "#10b98115", border: "1px solid #10b98140", borderRadius: 10, padding: "12px 16px", display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 20 }}>✔</span>
          <div style={{ fontSize: 12.5, color: "var(--green)" }}>
            <strong>Healthy Inventory:</strong> All tracked menu item quantities are currently above safety thresholds at this outlet.
          </div>
        </div>
      )}

      {/* Stock Table Component */}
      <StockTable 
        stockItems={inventory} 
        onAdjustStock={handleAdjustStock} 
        loading={loading} 
      />
    </div>
  );
}
