import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "@/services/axios";
import { setSelectedOutlet } from "@/features/auth/authSlice";
import toast from "react-hot-toast";

const ISearch = () => (
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
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IBell = () => (
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
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IChevDown = () => (
  <svg
    width={10}
    height={10}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IFilter = () => (
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
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const IRefresh = () => (
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
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

export function Topbar() {
  const dispatch = useDispatch();
  const selectedOutlet = useSelector((state) => state.auth.selectedOutlet);
  const [outlets, setOutlets] = useState([]);

  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const response = await axiosInstance.get("/outlets");
        if (response.data && response.data.data && response.data.data.outlets) {
          const fetchedOutlets = response.data.data.outlets;
          setOutlets(fetchedOutlets);
          if (fetchedOutlets.length > 0) {
            let currentSelectionId = null;
            try {
              const cached = localStorage.getItem("selectedOutlet");
              if (cached) {
                currentSelectionId = JSON.parse(cached)?.id;
              }
            } catch (e) {
              console.error(e);
            }
            const exists = fetchedOutlets.find(o => o.id === currentSelectionId);
            if (exists) {
              if (!selectedOutlet || selectedOutlet.id !== exists.id) {
                dispatch(setSelectedOutlet(exists));
              }
            } else {
              dispatch(setSelectedOutlet(fetchedOutlets[0]));
            }
          } else {
            dispatch(setSelectedOutlet(null));
          }
        }
      } catch (err) {
        console.error("Failed to fetch outlets in topbar", err);
      }
    };
    fetchOutlets();
  }, [dispatch]);

  const handleOutletChange = (e) => {
    const found = outlets.find((o) => o.id === e.target.value);
    if (found) {
      dispatch(setSelectedOutlet(found));
    }
  };

  const [notifications, setNotifications] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/notifications?limit=50");
      if (response.data && response.data.data && response.data.data.notifications) {
        setNotifications(response.data.data.notifications);
      }
    } catch (err) {
      console.error("Failed to fetch notifications in topbar", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000); // 20s polling
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkRead = async (id) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await axiosInstance.patch("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const handleDeleteNotif = async (id) => {
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success("Notification deleted");
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="topbar">
      <div className="search-box">
        <ISearch />
        <input placeholder="Search orders, customers, items…" type="text" />
        <kbd className="kbd">⌘K</kbd>
      </div>

      <div className="selector" style={{ position: "relative", padding: 0 }}>
        <span
          className="live-dot"
          style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
        />
        <select
          value={selectedOutlet?.id || ""}
          onChange={handleOutletChange}
          style={{
            background: "none",
            border: "none",
            color: "var(--text2)",
            fontSize: "12px",
            outline: "none",
            padding: "6px 24px 6px 24px",
            cursor: "pointer",
            appearance: "none",
            WebkitAppearance: "none",
            fontWeight: "500",
            width: "100%",
          }}
        >
          {outlets.length === 0 ? (
            <option value="" style={{ background: "var(--bg2)" }}>
              No Outlets
            </option>
          ) : (
            outlets.map((o) => (
              <option key={o.id} value={o.id} style={{ background: "var(--bg2)", color: "var(--text)" }}>
                {o.name}
              </option>
            ))
          )}
        </select>
        <span
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <IChevDown />
        </span>
      </div>

      <div className="selector">
        <span>Today, Jun 8</span>
        <IChevDown />
      </div>

      <div className="topbar-spacer" />

      <div className="topbar-actions">
        <div className="status-chip">
          <div className="status-dot" />
          <span>All Systems Live</span>
        </div>
        <button className="icon-btn">
          <IRefresh />
        </button>
        <button className="icon-btn">
          <IFilter />
        </button>
        <div style={{ position: "relative" }}>
          <button 
            className={`icon-btn${unreadCount > 0 ? " notif-dot" : ""}`}
            onClick={() => setShowNotifPanel(!showNotifPanel)}
          >
            <IBell />
          </button>
          {showNotifPanel && (
            <div style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 8px)",
              width: 320,
              maxHeight: 400,
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.4)",
              zIndex: 500,
              display: "flex",
              flexDirection: "column"
            }}>
              <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead} 
                    style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 11, cursor: "pointer", fontWeight: 600 }}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", padding: "4px 0" }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: 20, textAlign: "center", color: "var(--text3)", fontSize: 12 }}>
                    No alerts or notifications.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      style={{ 
                        padding: "10px 14px", 
                        borderBottom: "1px solid var(--border)", 
                        background: n.isRead ? "none" : "rgba(59, 130, 246, 0.05)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        position: "relative"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingRight: 16 }}>
                        <span style={{ fontWeight: n.isRead ? 500 : 700, color: n.isRead ? "var(--text2)" : "var(--text)" }}>{n.title}</span>
                        {!n.isRead && (
                          <button 
                            onClick={() => handleMarkRead(n.id)} 
                            style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 10, cursor: "pointer", fontWeight: 600, padding: 0 }}
                          >
                            Read
                          </button>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: "var(--text3)", margin: 0, lineHeight: 1.4 }}>{n.message}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                        <span style={{ fontSize: 10, color: "var(--text3)" }}>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <button 
                          onClick={() => handleDeleteNotif(n.id)} 
                          style={{ background: "none", border: "none", color: "var(--red)", fontSize: 10, cursor: "pointer", opacity: 0.8 }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <div className="avatar">AK</div>
      </div>
    </header>
  );
}
