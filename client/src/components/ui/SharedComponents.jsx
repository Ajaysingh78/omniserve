import { ShoppingBag } from "lucide-react";

export function SkeletonLoader({ width = "100%", height = 20, count = 1 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div 
          key={idx} 
          style={{ 
            width: "100%", 
            height, 
            borderRadius: 6, 
            background: "linear-gradient(90deg, var(--border) 25%, var(--border2) 50%, var(--border) 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite"
          }} 
        />
      ))}
    </div>
  );
}

export function EmptyStateWidget({ title = "No data found", description = "Try adjusting your filters or search terms." }) {
  return (
    <div style={{ padding: 40, border: "1px dashed var(--border)", borderRadius: 10, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justify: "center", gap: 8 }}>
      <ShoppingBag size={24} color="var(--text3)" />
      <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)" }}>{title}</span>
      <span style={{ fontSize: 12, color: "var(--text3)", maxWidth: 260 }}>{description}</span>
    </div>
  );
}

export function OverlaySpinner() {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10, 11, 13, 0.7)", zIndex: 9999, display: "flex", alignItems: "center", justify: "center" }}>
      <div className="spinner" style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTop: "3px solid var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export function StandardModal({ isOpen, title, onClose, children, footerActions }) {
  if (!isOpen) return null;

  return (
    <div className="pos-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pos-modal">
        <div className="pos-modal-header">
          <span>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer" }}>✕</button>
        </div>
        <div className="pos-modal-body">
          {children}
        </div>
        {footerActions && (
          <div className="pos-modal-footer">
            <button className="btn" onClick={onClose}>Close</button>
            {footerActions}
          </div>
        )}
      </div>
    </div>
  );
}
