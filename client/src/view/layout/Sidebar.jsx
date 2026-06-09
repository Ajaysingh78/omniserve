import { NAV_ITEMS } from "../../data/data";


const SvgIcon = ({ d, size = 14, className = "" }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round"
    className={className}
    style={{ flexShrink: 0 }}
  >
    <path d={d} />
  </svg>
);

const IChevLeft = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;

export function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`sidebar${collapsed ? " collapsed" : ""}`}>
      <div className="logo">
        <div className="logo-mark">FM</div>
        <div className="logo-text-wrap">
          <div className="logo-text">FoodMesh</div>
          <div className="logo-sub">Restaurant OS</div>
        </div>
      </div>

      <nav className="nav">
        {NAV_ITEMS.map((item) => (
          <div key={item.label} className={`nav-item${item.active ? " active" : ""}`}>
            <SvgIcon d={item.icon} size={15} />
            <span className="nav-label">{item.label}</span>
            {item.badge && !collapsed && (
              <span className="nav-badge">{item.badge}</span>
            )}
          </div>
        ))}
      </nav>

      <div className="collapse-btn" onClick={onToggle}>
        <span style={{ transform: collapsed ? "rotate(180deg)" : "none", display: "inline-flex", transition: "transform .2s" }}>
          <IChevLeft />
        </span>
        {!collapsed && <span className="collapse-label">Collapse</span>}
      </div>
    </aside>
  );
}