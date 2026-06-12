import { useState, useEffect } from "react";
import axiosInstance from "@/services/axios";
import toast from "react-hot-toast";

export default function WebhookLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
  const [retryingId, setRetryingId] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/webhooks/logs?limit=50`);
      if (res.data && res.data.data && res.data.data.logs) {
        setLogs(res.data.data.logs);
      }
    } catch (err) {
      console.error("Failed to load webhook logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleRetry = async (e, id) => {
    e.stopPropagation();
    setRetryingId(id);
    const loadingToast = toast.loading("Retrying webhook handler execution...");
    try {
      await axiosInstance.post(`/webhooks/logs/${id}/retry`);
      toast.dismiss(loadingToast);
      toast.success("Webhook retry completed successfully!");
      fetchLogs();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Retry execution failed");
    } finally {
      setRetryingId(null);
    }
  };

  const filteredLogs = logs.filter(log => {
    const provider = log.provider || "";
    const event = log.eventType || "";
    const status = log.status || "";
    return provider.toLowerCase().includes(search.toLowerCase()) ||
           event.toLowerCase().includes(search.toLowerCase()) ||
           status.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <style>{`
        .wh-table { width: 100%; border-collapse: collapse; text-align: left; }
        .wh-table th, .wh-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); }
        .wh-table th { background: var(--bg3); color: var(--text2); font-size: 11px; text-transform: uppercase; font-weight: 600; }
        .wh-table td { color: var(--text); font-size: 12.5px; }
        .wh-table tbody tr:hover { background: var(--bg3); cursor: pointer; }
        .wh-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 300; }
        .wh-modal { background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; width: 550px; max-height: 80vh; display: flex; flexDirection: column; overflow: hidden; }
        .wh-modal-body { padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
        .wh-json { background: var(--bg3); border: 1px solid var(--border); padding: 12px; border-radius: 6px; font-family: monospace; font-size: 11.5px; white-space: pre-wrap; color: var(--text2); }
      `}</style>

      {/* Header */}
      <div className="page-header">
        <div className="header-row">
          <div>
            <div className="page-title">Webhook Logs Integrator</div>
            <div className="page-sub">Track third-party webhook payloads, delivery success ratings, and trigger retry executions.</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" onClick={fetchLogs}>Refresh Logs</button>
            <input 
              type="text" 
              placeholder="Search provider, event, status…" 
              className="btn"
              style={{ background: "var(--bg3)", color: "var(--text)", padding: "7px 12px", width: 220, outline: "none", border: "1px solid var(--border)" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Webhook Log Table */}
      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, overflowX: "auto" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>Loading webhook logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>No webhook logs captured</div>
        ) : (
          <table className="wh-table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Event Type</th>
                <th>HTTP Code</th>
                <th>Status</th>
                <th>Retries</th>
                <th>Timestamp</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const isFailed = log.status === "FAILED" || log.status === "FAILURE";
                const isSuccess = log.status === "SUCCESS" || log.status === "PROCESSED";
                const badgeVariant = isFailed ? "badge-red" : isSuccess ? "badge-green" : "badge-amber";

                return (
                  <tr key={log.id || log._id} onClick={() => setSelectedLog(log)}>
                    <td style={{ fontWeight: 700 }}>{log.provider}</td>
                    <td style={{ fontWeight: 600 }}>{log.eventType}</td>
                    <td style={{ fontFamily: "monospace" }}>{log.httpStatusCode || "—"}</td>
                    <td>
                      <span className={`badge ${badgeVariant}`}>{log.status}</span>
                    </td>
                    <td>{log.retryCount} times</td>
                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                    <td>
                      <button 
                        className="btn" 
                        onClick={(e) => handleRetry(e, log.id || log._id)}
                        disabled={retryingId === (log.id || log._id)}
                        style={{ padding: "4px 8px", fontSize: 11 }}
                      >
                        {retryingId === (log.id || log._id) ? "Retrying..." : "Retry"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Payload Modal */}
      {selectedLog && (
        <div className="wh-modal-overlay" onClick={() => setSelectedLog(null)}>
          <div className="wh-modal" onClick={e => e.stopPropagation()}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
              <span>Webhook Payload Details: {selectedLog.eventType}</span>
              <button onClick={() => setSelectedLog(null)} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer" }}>✕</button>
            </div>
            <div className="wh-modal-body">
              <div>
                <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, display: "block", marginBottom: 6 }}>Received JSON Payload</span>
                <div className="wh-json">
                  {JSON.stringify(selectedLog.payload, null, 2)}
                </div>
              </div>
              {selectedLog.errorMessage && (
                <div>
                  <span style={{ fontSize: 11, color: "var(--red)", fontWeight: 600, display: "block", marginBottom: 4 }}>Error Message</span>
                  <div style={{ fontSize: 12, color: "var(--red)", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", padding: 8, borderRadius: 6 }}>
                    {selectedLog.errorMessage}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
