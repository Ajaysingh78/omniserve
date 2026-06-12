import { useState } from "react";
import axiosInstance from "@/services/axios";
import toast from "react-hot-toast";

const IClose = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const Badge = ({ children, variant = "gray" }) => (
  <span className={`badge badge-${variant}`}>{children}</span>
);

export default function OrderDetailsDrawer({ order, onClose, onRefresh }) {
  const [updating, setUpdating] = useState(false);
  if (!order) return null;

  const handleUpdateStatus = async (nextStatus) => {
    setUpdating(true);
    const loadingToast = toast.loading(`Updating order status to ${nextStatus}...`);
    try {
      await axiosInstance.patch(`/orders/${order.id}/status`, {
        orderStatus: nextStatus,
      });
      toast.dismiss(loadingToast);
      toast.success(`Order status updated to ${nextStatus}!`);
      if (onRefresh) onRefresh();
      onClose();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    const reason = prompt("Enter reason for order cancellation:", "Customer requested cancellation");
    if (!reason) return;

    setUpdating(true);
    const loadingToast = toast.loading("Cancelling order...");
    try {
      await axiosInstance.patch(`/orders/${order.id}/cancel`, {
        cancellationReason: reason,
      });
      toast.dismiss(loadingToast);
      toast.success("Order cancelled successfully!");
      if (onRefresh) onRefresh();
      onClose();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to cancel order");
    } finally {
      setUpdating(false);
    }
  };

  // Build dynamic timeline from timestamps
  const timeline = [];
  if (order.createdAt) {
    timeline.push({ color: "var(--green)", time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: `Placed via ${order.source}` });
  }
  if (order.acceptedAt) {
    timeline.push({ color: "var(--accent)", time: new Date(order.acceptedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: "Order Accepted" });
  }
  if (order.preparedAt) {
    timeline.push({ color: "var(--amber)", time: new Date(order.preparedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: "Preparation Started" });
  }
  if (order.readyAt) {
    timeline.push({ color: "var(--teal)", time: new Date(order.readyAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: "Ready for Pickup/Delivery" });
  }
  if (order.deliveredAt) {
    timeline.push({ color: "var(--blue)", time: new Date(order.deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: "Delivered successfully" });
  }
  if (order.cancelledAt) {
    timeline.push({ color: "var(--red)", time: new Date(order.cancelledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: `Cancelled: ${order.cancellationReason || "No reason specified"}` });
  }

  const customerName = order.customerId 
    ? `${order.customerId.firstName} ${order.customerId.lastName || ""}`
    : "Walk-in Customer";

  return (
    <div className="drawer-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="drawer">
        {/* Header */}
        <div className="drawer-header">
          <div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 2 }}>{order.orderNumber || order.id}</div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{customerName}</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Badge variant={order.paymentStatus === "PAID" ? "green" : "amber"}>
              {order.paymentStatus === "PAID" ? "Paid" : "Pending"}
            </Badge>
            <button className="icon-btn" onClick={onClose}><IClose /></button>
          </div>
        </div>

        {/* Customer Info */}
        <div className="drawer-section">
          <div className="ds-title">Customer Info</div>
          {[
            ["Name", customerName],
            ["Phone", order.customerId?.phone || "N/A"],
            ["Channel / Source", order.source],
            ["Time Placed", order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"],
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
          {timeline.length > 0 ? (
            timeline.map((t, i) => (
              <div key={i} className="timeline-item">
                <div className="tl-dot" style={{ background: t.color }} />
                <span className="tl-time">{t.time}</span>
                <span className="tl-text">{t.text}</span>
              </div>
            ))
          ) : (
            <div style={{ color: "var(--text3)", fontSize: 12 }}>No events logged yet.</div>
          )}
        </div>

        {/* Items */}
        <div className="drawer-section">
          <div className="ds-title">Items Ordered</div>
          {order.items?.map((item, i) => (
            <div key={i} className="item-row">
              <div>
                <div className="item-name">{item.name}</div>
                <div className="item-qty">Qty: {item.quantity}</div>
              </div>
              <div className="item-price">₹{item.unitPrice}</div>
            </div>
          )) || <div style={{ color: "var(--text3)", fontSize: 12 }}>No items details loaded.</div>}
          <div className="item-total">
            <span>Total</span>
            <span>₹{order.totalAmount?.toLocaleString() || "0"}</span>
          </div>
        </div>

        {/* Payment */}
        <div className="drawer-section">
          <div className="ds-title">Payment Details</div>
          {[
            ["Method", order.payment?.paymentMethod || "COD"],
            ["Status", order.paymentStatus || "PENDING"],
            ["Transaction ID", order.payment?.transactionId || "N/A"],
            ["Amount Paid", `₹${(order.payment?.amount || order.totalAmount)?.toLocaleString()}`],
          ].map(([l, v]) => (
            <div key={l} className="ds-row">
              <span className="ds-label">{l}</span>
              <span className="ds-value" style={{ color: l === "Status" && order.paymentStatus === "PAID" ? "var(--green)" : undefined }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="drawer-section">
          <div className="ds-title">Actions</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {order.orderStatus === "PENDING" && (
              <>
                <button className="btn primary" onClick={() => handleUpdateStatus("ACCEPTED")} disabled={updating}>
                  Accept Order
                </button>
                <button className="btn" onClick={handleCancelOrder} style={{ color: "var(--red)" }} disabled={updating}>
                  Cancel Order
                </button>
              </>
            )}
            {order.orderStatus === "ACCEPTED" && (
              <>
                <button className="btn primary" onClick={() => handleUpdateStatus("PREPARING")} disabled={updating}>
                  Mark Preparing
                </button>
                <button className="btn" onClick={handleCancelOrder} style={{ color: "var(--red)" }} disabled={updating}>
                  Cancel Order
                </button>
              </>
            )}
            {order.orderStatus === "PREPARING" && (
              <button className="btn primary" onClick={() => handleUpdateStatus("READY")} disabled={updating}>
                Mark Ready
              </button>
            )}
            {order.orderStatus === "READY" && (
              <button className="btn primary" onClick={() => handleUpdateStatus("DELIVERED")} disabled={updating}>
                Mark Delivered
              </button>
            )}
            {(order.orderStatus === "DELIVERED" || order.orderStatus === "COMPLETED" || order.orderStatus === "CANCELLED") && (
              <div style={{ color: "var(--text3)", fontSize: 12 }}>No actions available for this order status.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
