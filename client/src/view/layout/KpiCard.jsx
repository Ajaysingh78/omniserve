// ─── SIDEBAR ─────────────────────────────────────────────────────────────────



// ─── TOPBAR ──────────────────────────────────────────────────────────────────


// ─── KPI CARD ────────────────────────────────────────────────────────────────

// function KPICard({ label, value, trend, sub, accent, trendUp }) {
//   return (
//     <div className="kpi-card" style={{ borderTop: `2px solid ${accent}` }}>
//       <div className="kpi-label">{label}</div>
//       <div className="kpi-value">{value}</div>
//       {trend && (
//         <div className={`kpi-trend ${trendUp === true ? "up" : trendUp === false ? "down" : "neutral"}`}>
//           {trend}
//         </div>
//       )}
//       {sub && <div className="kpi-sub">{sub}</div>}
//     </div>
//   );
// }

// ─── CHANNEL CARD ────────────────────────────────────────────────────────────

// function ChannelCard({ ch }) {
//   return (
//     <div className="channel-card">
//       <div className="channel-top">
//         <span className="channel-name">{ch.name}</span>
//         <div className={ch.live ? "live-dot" : "offline-dot"} />
//       </div>
//       <div className="channel-orders">{ch.orders}</div>
//       <div className="channel-rev">{ch.rev}</div>
//       <div className="channel-growth" style={{ color: ch.up ? "var(--green)" : "var(--red)" }}>
//         {ch.growth} vs yesterday
//       </div>
//       <div className="channel-avg">Avg {ch.avg}</div>
//     </div>
//   );
// }