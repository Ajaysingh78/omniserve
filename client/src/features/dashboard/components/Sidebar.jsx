import { NAV_ITEMS } from "../../../data/data";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const SvgIcon = ({ d, size = 14, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ flexShrink: 0 }}
  >
    <path d={d} />
  </svg>
);

const IChevLeft = () => (
  <svg
    width={14}
    height={14}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const pathMap = {
  "Overview": "/dashboard",
  "Online Orders": "/orders",
  "Offline Orders": "/pos",
  "Payment": "/subscriptions",
  "Inventory": "/inventory",
  "Procurement": "/inventory",
  "CRM": "/crm",
  "Staff": "/dashboard",
  "WhatsApp": "/dashboard",
  "Analytics": "/analytics",
  "Settings": "/settings",
};

export function Sidebar({ collapsed, onToggle }) {
  const user = useSelector((state) => state.auth.user);
  const isAdminOrOwner = user?.role === "SUPER_ADMIN" || user?.role === "RESTAURANT_OWNER";

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
        {NAV_ITEMS.map((item) => {
          const path = pathMap[item.label] || "/dashboard";
          return (
            <NavLink
              key={item.label}
              to={path}
              className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
              style={{ textDecoration: "none" }}
            >
              <SvgIcon d={item.icon} size={15} />
              <span className="nav-label">{item.label}</span>
              {item.badge && !collapsed && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </NavLink>
          );
        })}

        {isAdminOrOwner && (
          <>
            <div style={{ height: 1, background: "var(--border)", margin: "10px 4px" }} />
            
            <NavLink
              to="/audit-logs"
              className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
              style={{ textDecoration: "none" }}
            >
              <SvgIcon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" size={15} />
              <span className="nav-label">Audit Logs</span>
            </NavLink>

            <NavLink
              to="/webhooks"
              className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
              style={{ textDecoration: "none" }}
            >
              <SvgIcon d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" size={15} />
              <span className="nav-label">Webhook Logs</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="collapse-btn" onClick={onToggle}>
        <span
          style={{
            transform: collapsed ? "rotate(180deg)" : "none",
            display: "inline-flex",
            transition: "transform .2s",
          }}
        >
          <IChevLeft />
        </span>
        {!collapsed && <span className="collapse-label">Collapse</span>}
      </div>
    </aside>
  );
}

