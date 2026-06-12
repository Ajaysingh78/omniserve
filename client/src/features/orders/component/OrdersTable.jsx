import { useState } from "react";

const CH_COLORS = {
  DINE_IN: "badge-blue",
  TAKEAWAY: "badge-green",
  DELIVERY: "badge-purple",
  ONLINE: "badge-amber",
};

export default function OrdersTable({ orders, onSelectOrder }) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  
  if (!orders || orders.length === 0) {
    return (
      <div className="empty-col" style={{ padding: 40, background: "var(--bg2)", borderRadius: 10, border: "1px solid var(--border)" }}>
        <span>No orders match this criteria</span>
      </div>
    );
  }

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const displayedOrders = orders.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
      <style>{`
        .table-wrap { width: 100%; overflow-x: auto; }
        .data-table { width: 100%; border-collapse: collapse; text-align: left; }
        .data-table th, .data-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); }
        .data-table th { background: var(--bg3); color: var(--text2); font-weight: 600; text-transform: uppercase; font-size: 11px; }
        .data-table td { color: var(--text); }
        .data-table tbody tr:hover { background: var(--bg3); cursor: pointer; }
        .table-footer { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--bg3); }
        .page-btn { padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border); background: var(--bg2); color: var(--text2); cursor: pointer; }
        .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>
      
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Customer</th>
              <th>Channel Source</th>
              <th>Items</th>
              <th>Bill Amount</th>
              <th>Payment Status</th>
              <th>Date Placed</th>
              <th>Order Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedOrders.map((o) => {
              const chVariant = CH_COLORS[o.source] || "badge-gray";
              const paidClass = o.paymentStatus === "PAID" ? "badge-green" : "badge-amber";
              const customerName = o.customerId 
                ? `${o.customerId.firstName} ${o.customerId.lastName || ""}`
                : "Walk-in Customer";

              return (
                <tr key={o.id} onClick={() => onSelectOrder(o)}>
                  <td style={{ fontWeight: 700 }}>{o.orderNumber || o.id}</td>
                  <td>{customerName}</td>
                  <td>
                    <span className={`badge ${chVariant}`}>{o.source}</span>
                  </td>
                  <td>
                    {o.items?.map((item) => `${item.name} x${item.quantity}`).join(", ") || "Click to view items"}
                  </td>
                  <td style={{ fontWeight: 600 }}>₹{o.totalAmount?.toLocaleString() || "0"}</td>
                  <td>
                    <span className={`badge ${paidClass}`}>{o.paymentStatus}</span>
                  </td>
                  <td style={{ fontSize: 11.5 }}>
                    {o.createdAt ? new Date(o.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : "N/A"}
                  </td>
                  <td>
                    <span className="badge badge-blue">{o.orderStatus}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <span style={{ color: "var(--text3)", fontSize: 12 }}>
          Showing {(page - 1) * itemsPerPage + 1}-{Math.min(page * itemsPerPage, orders.length)} of {orders.length} orders
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
          <span style={{ alignSelf: "center", color: "var(--text)" }}>Page {page} of {totalPages}</span>
          <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
}
