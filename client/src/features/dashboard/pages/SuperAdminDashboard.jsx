import { useState } from "react";
import toast from "react-hot-toast";

const initialTenants = [
  { id: "T1", name: "Royal Spice Restaurant", owner: "Ajay Kumar", slug: "royal-spice", plan: "PRO", status: "Active", outlets: 3 },
  { id: "T2", name: "The Pizza Palace", owner: "Rakesh Sharma", slug: "pizza-palace", plan: "ENTERPRISE", status: "Active", outlets: 7 },
  { id: "T3", name: "Cafe Caffeine", owner: "Sneha Sen", slug: "cafe-caffeine", plan: "FREE", status: "Active", outlets: 1 },
  { id: "T4", name: "Desi Dhaba", owner: "Gurpreet Singh", slug: "desi-dhaba", plan: "PRO", status: "Suspended", outlets: 2 },
];

export default function SuperAdminDashboard() {
  const [tenants, setTenants] = useState(initialTenants);
  const [search, setSearch] = useState("");

  const toggleTenantStatus = (id) => {
    setTenants(prev => 
      prev.map(t => {
        if (t.id === id) {
          const nextStatus = t.status === "Active" ? "Suspended" : "Active";
          toast.success(`Tenant ${t.name} is now ${nextStatus}`);
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const changeTenantPlan = (id, newPlan) => {
    setTenants(prev => 
      prev.map(t => {
        if (t.id === id) {
          toast.success(`Plan updated for ${t.name} to ${newPlan}`);
          return { ...t, plan: newPlan };
        }
        return t;
      })
    );
  };

  const filtered = tenants.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.owner.toLowerCase().includes(search.toLowerCase()) ||
    t.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div className="page-header">
        <div className="header-row">
          <div>
            <div className="page-title">SaaS Control Center</div>
            <div className="page-sub">Global platform management, subscription controls, and tenant monitoring.</div>
          </div>
          <input 
            type="text" 
            placeholder="Search business, owner, slug…" 
            className="btn"
            style={{ background: "var(--bg3)", color: "var(--text)", padding: "7px 12px", width: 220, outline: "none", border: "1px solid var(--border)" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Global SaaS Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { label: "Total Tenants", value: "32", change: "+4 this month", color: "var(--accent)" },
          { label: "Active Outlets", value: "84", change: "+12 live", color: "var(--green)" },
          { label: "MRR", value: "₹4.82L", change: "+18% growth", color: "var(--purple)" },
          { label: "Alerts / Tickets", value: "0", change: "All systems operational", color: "var(--teal)" },
        ].map((c, idx) => (
          <div key={idx} className="kpi-card">
            <span className="kpi-label" style={{ display: "block", color: "var(--text3)", fontSize: 10.5 }}>{c.label}</span>
            <span style={{ display: "block", fontSize: 24, fontWeight: 700, margin: "6px 0", color: c.color }}>{c.value}</span>
            <span style={{ fontSize: 11, color: "var(--text2)" }}>{c.change}</span>
          </div>
        ))}
      </div>

      {/* Tenant Directory Table */}
      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
        <style>{`
          .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
          .admin-table th, .admin-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); }
          .admin-table th { background: var(--bg3); color: var(--text2); font-size: 11px; text-transform: uppercase; font-weight: 600; }
          .admin-table td { color: var(--text); font-size: 12.5px; }
          .plan-select { background: var(--bg4); border: 1px solid var(--border); border-radius: 4px; padding: 2px 6px; color: var(--text); outline: none; font-size: 11.5px; }
        `}</style>
        
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tenant ID</th>
              <th>Business Name</th>
              <th>Owner Name</th>
              <th>URL Slug</th>
              <th>Total Outlets</th>
              <th>Subscription Plan</th>
              <th>Status</th>
              <th>Global Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id}>
                <td style={{ fontWeight: 700 }}>{t.id}</td>
                <td style={{ fontWeight: 600 }}>{t.name}</td>
                <td>{t.owner}</td>
                <td><code style={{ background: "var(--bg3)", padding: "2px 4px", borderRadius: 3, fontSize: 11.5 }}>{t.slug}</code></td>
                <td style={{ textAlign: "center" }}>{t.outlets}</td>
                <td>
                  <select 
                    value={t.plan}
                    onChange={(e) => changeTenantPlan(t.id, e.target.value)}
                    className="plan-select"
                  >
                    <option value="FREE">FREE</option>
                    <option value="PRO">PRO</option>
                    <option value="ENTERPRISE">ENTERPRISE</option>
                  </select>
                </td>
                <td>
                  <span className={`badge ${t.status === "Active" ? "badge-green" : "badge-red"}`}>
                    {t.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button 
                      className="btn" 
                      onClick={() => toggleTenantStatus(t.id)} 
                      style={{ padding: "4px 8px", fontSize: 11, borderColor: t.status === "Active" ? "var(--red)" : "var(--green)" }}
                    >
                      {t.status === "Active" ? "Suspend" : "Activate"}
                    </button>
                    <button className="btn" onClick={() => toast.success(`Audit logs fetched for ${t.slug}`)} style={{ padding: "4px 8px", fontSize: 11 }}>
                      Logs
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
