const IClose = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const Badge = ({ children, variant = "gray" }) => (
  <span className={`badge badge-${variant}`}>{children}</span>
);

export default function OrderDetailsDrawer({ order, onClose }) {
  if (!order) return null;

  const timeline = [
    { color: "var(--green)", time: "12:04", text: `Order placed via ${order.ch}` },
    { color: "var(--accent)", time: "12:05", text: "Assigned to kitchen" },
    { color: "var(--amber)", time: "12:08", text: "Preparation started" },
    ...(order.col === "ready" ? [{ color: "var(--teal)", time: "12:22", text: "Ready for pickup/delivery" }] : []),
  ];

  return (
    <div className="drawer-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="drawer">
        {/* Header */}
        <div className="drawer-header">
          <div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 2 }}>{order.id}</div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{order.name}</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Badge variant={order.paid ? "green" : "amber"}>{order.paid ? "Paid" : "Pending"}</Badge>
            <button className="icon-btn" onClick={onClose}><IClose /></button>
          </div>
        </div>

        {/* Customer Info */}
        <div className="drawer-section">
          <div className="ds-title">Customer Info</div>
          {[
            ["Name", order.name],
            ["Channel", order.ch],
            ["Order Type", order.delivery],
            ["Priority", order.pr.toUpperCase()],
            ["Time", `${order.mins} minutes ago`],
          ].map(([l, v]) => (
            <div key={l} className="ds-row">
              <span className="ds-label">{l}</span>
              <span className="ds-value">{v}</span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="drawer-section">
          <div className="ds-title">Order Timeline</div>
          {timeline.map((t, i) => (
            <div key={i} className="timeline-item">
              <div className="tl-dot" style={{ background: t.color }} />
              <span className="tl-time">{t.time}</span>
              <span className="tl-text">{t.text}</span>
            </div>
          ))}
        </div>

        {/* Items */}
        <div className="drawer-section">
          <div className="ds-title">Items Ordered</div>
          {order.items?.map((item, i) => (
            <div key={i} className="item-row">
              <div>
                <div className="item-name">{item.name}</div>
                <div className="item-qty">Qty: {item.qty}</div>
              </div>
              <div className="item-price">₹{item.price}</div>
            </div>
          )) || <div style={{ color: "var(--text3)", fontSize: 12 }}>No Items Available</div>}
          <div className="item-total">
            <span>Total</span>
            <span>₹{order.val.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment */}
        <div className="drawer-section">
          <div className="ds-title">Payment Details</div>
          {[
            ["Method", "UPI – PhonePe"],
            ["Status", order.paid ? "Paid" : "Pending"],
            ["Transaction ID", "TXN-MOCK-" + order.id.replace("ORD-", "")],
            ["Amount", `₹${order.val.toLocaleString()}`],
          ].map(([l, v]) => (
            <div key={l} className="ds-row">
              <span className="ds-label">{l}</span>
              <span className="ds-value" style={{ color: l === "Status" && order.paid ? "var(--green)" : undefined }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="drawer-section">
          <div className="ds-title">Actions</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Accept Order", "Mark Ready", "Add Note", "Print KOT", "Assign Rider"].map((a) => (
              <button key={a} className={`btn${a === "Accept Order" ? " primary" : ""}`}>{a}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
