import { useState, useEffect } from "react";
import axiosInstance from "@/services/axios";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/audit-logs?limit=50`);
      if (res.data && res.data.data && res.data.data.auditLogs) {
        setLogs(res.data.data.auditLogs);
      }
    } catch (err) {
      console.error("Failed to load audit logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const action = log.action || "";
    const type = log.entityType || "";
    const userEmail = log.userId?.email || "";
    return action.toLowerCase().includes(search.toLowerCase()) ||
           type.toLowerCase().includes(search.toLowerCase()) ||
           userEmail.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <style>{`
        .al-table { width: 100%; border-collapse: collapse; text-align: left; }
        .al-table th, .al-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); }
        .al-table th { background: var(--bg3); color: var(--text2); font-size: 11px; text-transform: uppercase; font-weight: 600; }
        .al-table td { color: var(--text); font-size: 12.5px; }
        .al-table tbody tr:hover { background: var(--bg3); cursor: pointer; }
        .inspect-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 300; }
        .inspect-modal { background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; width: 600px; max-height: 80vh; display: flex; flexDirection: column; overflow: hidden; }
        .inspect-modal-body { padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
        .json-block { background: var(--bg3); border: 1px solid var(--border); padding: 12px; border-radius: 6px; font-family: monospace; font-size: 11.5px; white-space: pre-wrap; color: var(--text2); }
      `}</style>

      {/* Header */}
      <div className="page-header">
        <div className="header-row">
          <div>
            <div className="page-title">Security Audit Logging</div>
            <div className="page-sub">Trace back authorization changes, configuration updates, and multi-tenant security logs.</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" onClick={fetchLogs}>Refresh Logs</button>
            <input 
              type="text" 
              placeholder="Search user, action, type…" 
              className="btn"
              style={{ background: "var(--bg3)", color: "var(--text)", padding: "7px 12px", width: 220, outline: "none", border: "1px solid var(--border)" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, overflowX: "auto" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>Loading system logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>No security logs found</div>
        ) : (
          <table className="al-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Target Type</th>
                <th>Target ID</th>
                <th>Operator User</th>
                <th>IP Address</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const isDelete = log.action.includes("DELETE") || log.action.includes("CANCEL");
                const isCreate = log.action.includes("CREATE") || log.action.includes("POST");
                const badgeVariant = isDelete ? "badge-red" : isCreate ? "badge-green" : "badge-blue";

                return (
                  <tr key={log.id || log._id} onClick={() => setSelectedLog(log)}>
                    <td>
                      <span className={`badge ${badgeVariant}`}>{log.action}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{log.entityType}</td>
                    <td style={{ fontFamily: "monospace" }}>{log.entityId}</td>
                    <td>{log.userId?.email || log.userId || "System Daemon"}</td>
                    <td>{log.ipAddress || "Localhost"}</td>
                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Inspect Log Diff Modal */}
      {selectedLog && (
        <div className="inspect-modal-overlay" onClick={() => setSelectedLog(null)}>
          <div className="inspect-modal" onClick={e => e.stopPropagation()}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
              <span>Log Details: {selectedLog.action} on {selectedLog.entityType}</span>
              <button onClick={() => setSelectedLog(null)} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer" }}>✕</button>
            </div>
            <div className="inspect-modal-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, display: "block", marginBottom: 6 }}>Old State (Pre-action)</span>
                  <div className="json-block">
                    {selectedLog.oldData ? JSON.stringify(selectedLog.oldData, null, 2) : "Null / Empty State"}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, display: "block", marginBottom: 6 }}>New State (Post-action)</span>
                  <div className="json-block">
                    {selectedLog.newData ? JSON.stringify(selectedLog.newData, null, 2) : "Null / Empty State"}
                  </div>
                </div>
              </div>
              <div>
                <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, display: "block", marginBottom: 4 }}>User Agent String</span>
                <div style={{ fontSize: 12, color: "var(--text2)", background: "var(--bg3)", padding: 8, borderRadius: 6, border: "1px solid var(--border)" }}>
                  {selectedLog.userAgent || "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
