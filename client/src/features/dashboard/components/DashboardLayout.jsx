import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:     #0a0b0d;
          --bg2:    #111318;
          --bg3:    #16191f;
          --bg4:    #1d2026;
          --border: #2a2d35;
          --border2:#363a45;
          --text:   #e8eaf0;
          --text2:  #9aa0b0;
          --text3:  #5c6270;
          --accent: #3b82f6;
          --accent2:#1d4ed8;
          --green:  #10b981;
          --red:    #ef4444;
          --amber:  #f59e0b;
          --purple: #8b5cf6;
          --teal:   #06b6d4;
          --radius: 10px;
          --radius2: 6px;
        }

        html, body, #root { height: 100%; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; font-size: 13px; background: var(--bg); color: var(--text); }

        /* ── LAYOUT ── */
        .app { display: flex; height: 100vh; overflow: hidden; background: var(--bg); }
        .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .content { flex: 1; overflow-y: auto; padding: 20px 24px; background: var(--bg); scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
        .content::-webkit-scrollbar { width: 4px; }
        .content::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

        /* ── SIDEBAR ── */
        .sidebar { width: 220px; min-width: 220px; background: var(--bg2); border-right: 1px solid var(--border); display: flex; flex-direction: column; transition: width .2s, min-width .2s; overflow: hidden; }
        .sidebar.collapsed { width: 56px; min-width: 56px; }
        .logo { padding: 16px 14px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid var(--border); }
        .logo-mark { width: 28px; height: 28px; background: linear-gradient(135deg,#3b82f6,#8b5cf6); border-radius: 7px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; color: #fff; flex-shrink: 0; }
        .logo-text-wrap { overflow: hidden; }
        .logo-text { font-weight: 700; font-size: 15px; letter-spacing: -.3px; white-space: nowrap; }
        .logo-sub  { font-size: 10px; color: var(--text3); white-space: nowrap; }
        .sidebar.collapsed .logo-text-wrap { display: none; }
        .nav { flex: 1; padding: 8px 6px; overflow-y: auto; }
        .nav-item { display: flex; align-items: center; gap: 9px; padding: 8px 10px; border-radius: var(--radius2); cursor: pointer; transition: all .15s; color: var(--text2); margin-bottom: 1px; white-space: nowrap; overflow: hidden; }
        .nav-item:hover { background: var(--bg3); color: var(--text); }
        .nav-item.active { background: rgba(59,130,246,.15); color: var(--accent); }
        .nav-label { font-size: 12.5px; font-weight: 500; }
        .sidebar.collapsed .nav-label { display: none; }
        .nav-badge { margin-left: auto; background: var(--red); color: #fff; font-size: 10px; padding: 1px 6px; border-radius: 20px; font-weight: 600; }
        .sidebar.collapsed .nav-badge { display: none; }
        .collapse-btn { padding: 10px 14px; border-top: 1px solid var(--border); cursor: pointer; color: var(--text3); display: flex; align-items: center; gap: 8px; font-size: 12px; }
        .collapse-btn:hover { color: var(--text2); }
        .collapse-label { white-space: nowrap; }
        .sidebar.collapsed .collapse-label { display: none; }

        /* ── TOPBAR ── */
        .topbar { height: 52px; background: var(--bg2); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 20px; gap: 12px; flex-shrink: 0; }
        .search-box { display: flex; align-items: center; gap: 8px; background: var(--bg3); border: 1px solid var(--border); border-radius: var(--radius2); padding: 6px 12px; flex: 1; max-width: 280px; }
        .search-box input { background: none; border: none; outline: none; color: var(--text); font-size: 12px; width: 100%; }
        .search-box input::placeholder { color: var(--text3); }
        .kbd { font-size: 10px; color: var(--text3); background: var(--bg4); padding: 1px 5px; border-radius: 3px; border: 1px solid var(--border); white-space: nowrap; }
        .selector { display: flex; align-items: center; gap: 6px; background: var(--bg3); border: 1px solid var(--border); border-radius: var(--radius2); padding: 6px 10px; cursor: pointer; font-size: 12px; color: var(--text2); }
        .selector:hover { border-color: var(--border2); }
        .topbar-spacer { flex: 1; }
        .topbar-actions { display: flex; align-items: center; gap: 8px; }
        .status-chip { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text2); }
        .status-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); box-shadow: 0 0 6px var(--green); flex-shrink: 0; }
        .icon-btn { width: 32px; height: 32px; border-radius: var(--radius2); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text2); background: var(--bg3); border: 1px solid var(--border); transition: all .15s; }
        .icon-btn:hover { background: var(--bg4); color: var(--text); }
        .notif-dot { position: relative; }
        .notif-dot::after { content: ''; position: absolute; top: 4px; right: 4px; width: 7px; height: 7px; background: var(--red); border-radius: 50%; border: 1.5px solid var(--bg2); }
        .avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg,#3b82f6,#8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #fff; cursor: pointer; flex-shrink: 0; }

        /* ── PAGE HEADER ── */
        .page-header { margin-bottom: 20px; }
        .header-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
        .page-title { font-size: 20px; font-weight: 700; letter-spacing: -.4px; color: var(--text); }
        .page-sub   { font-size: 12.5px; color: var(--text2); margin-top: 3px; }
        .header-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

        /* ── BUTTONS ── */
        .btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px; border-radius: var(--radius2); font-size: 12px; font-weight: 500; cursor: pointer; border: 1px solid var(--border); background: var(--bg3); color: var(--text2); transition: all .15s; }
        .btn:hover { background: var(--bg4); color: var(--text); }
        .btn.primary { background: var(--accent); border-color: var(--accent2); color: #fff; }
        .btn.primary:hover { background: var(--accent2); }

        /* ── TABS ── */
        .tabs { display: flex; gap: 2px; margin-bottom: 20px; background: var(--bg2); padding: 4px; border-radius: var(--radius2); border: 1px solid var(--border); width: fit-content; }
        .tab { padding: 5px 14px; border-radius: 4px; font-size: 12px; font-weight: 500; cursor: pointer; color: var(--text2); transition: all .15s; border: 1px solid transparent; }
        .tab:hover { color: var(--text); }
        .tab.active { background: var(--bg3); color: var(--text); border-color: var(--border); }
      `}</style>

      <div className="app">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        <div className="main">
          <Topbar />
          <div className="content">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
