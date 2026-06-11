import { useState } from "react";

const CH_COLORS = {
  Swiggy: "badge-amber",
  Zomato: "badge-red",
  ONDC: "badge-purple",
  Website: "badge-blue",
  App: "badge-blue",
  WhatsApp: "badge-green",
  Call: "badge-gray",
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
              <th>Order ID</th>
              <th>Customer</th>
              <th>Channel</th>
              <th>Items</th>
              <th>Bill Amount</th>
              <th>Paid</th>
              <th>Type</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedOrders.map((o) => {
              const chVariant = CH_COLORS[o.ch] || "badge-gray";
              const priorityClass = o.pr === "high" ? "badge-red" : o.pr === "med" ? "badge-amber" : "badge-gray";
              const paidClass = o.paid ? "badge-green" : "badge-amber";

              return (
                <tr key={o.id} onClick={() => onSelectOrder(o)}>
                  <td style={{ fontWeight: 700 }}>{o.id}</td>
                  <td>{o.name}</td>
                  <td>
                    <span className={`badge ${chVariant}`}>{o.ch}</span>
                  </td>
                  <td>
                    {o.items?.map((item) => `${item.name} x${item.qty}`).join(", ") || "No Items"}
                  </td>
                  <td style={{ fontWeight: 600 }}>₹{o.val.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${paidClass}`}>{o.paid ? "Paid" : "Pending"}</span>
                  </td>
                  <td>
                    <span className="badge badge-gray">{o.delivery}</span>
                  </td>
                  <td>
                    <span className={`badge ${priorityClass}`}>{o.pr.toUpperCase()}</span>
                  </td>
                  <td>
                    <span className="badge badge-blue">{o.col.toUpperCase()}</span>
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
