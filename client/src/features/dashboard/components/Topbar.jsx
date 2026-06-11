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
  return (
    <header className="topbar">
      <div className="search-box">
        <ISearch />
        <input placeholder="Search orders, customers, items…" type="text" />
        <kbd className="kbd">⌘K</kbd>
      </div>

      <div className="selector">
        <span className="live-dot" />
        <span>Indrapuri sector C</span>
        <IChevDown />
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
        <button className="icon-btn notif-dot">
          <IBell />
        </button>
        <div className="avatar">AK</div>
      </div>
    </header>
  );
}
