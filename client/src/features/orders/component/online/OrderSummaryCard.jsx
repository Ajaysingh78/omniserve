import { useState, useEffect, useCallback } from "react";
import {
  ShoppingBag,
  PackagePlus,
  ChefHat,
  CheckCircle2,
  Truck,
  XCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  AlertTriangle,
  BarChart3,
} from "lucide-react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  bg: "#07091280",
  card: "#0D1526",
  cardHover: "#111D36",
  border: "#1A2744",
  borderHover: "#2A3F6B",
  muted: "#334166",
  mutedText: "#4D6080",
  subtleText: "#6B84A8",
  bodyText: "#8FA4C4",
  primaryText: "#C8D8EE",
  brightText: "#E8F0FA",
  blue: "#3B82F6",
  blueGlow: "#3B82F620",
  emerald: "#10B981",
  emeraldGlow: "#10B98120",
  amber: "#F59E0B",
  amberGlow: "#F59E0B20",
  rose: "#F43F5E",
  roseGlow: "#F43F5E20",
  purple: "#8B5CF6",
  purpleGlow: "#8B5CF620",
  cyan: "#06B6D4",
  cyanGlow: "#06B6D420",
};

// ─── Static Styles ────────────────────────────────────────────────────────────
const S = {
  root: {
    fontFamily: "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif",
    background: "transparent",
    padding: "0",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "12px",
  },
  headerLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  sectionLabel: {
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: T.blue,
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: T.brightText,
    letterSpacing: "-0.02em",
    lineHeight: 1.2,
  },
  sectionSub: {
    fontSize: "12px",
    color: T.subtleText,
    marginTop: "2px",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  periodBadge: {
    fontSize: "11px",
    fontWeight: 500,
    color: T.bodyText,
    background: "#111D36",
    border: `1px solid ${T.border}`,
    borderRadius: "6px",
    padding: "5px 10px",
    letterSpacing: "0.01em",
  },
  refreshBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11px",
    fontWeight: 500,
    color: T.subtleText,
    background: "#111D36",
    border: `1px solid ${T.border}`,
    borderRadius: "6px",
    padding: "5px 10px",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "12px",
  },
  card: {
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: "12px",
    padding: "18px 20px 0 20px",
    position: "relative",
    overflow: "hidden",
    cursor: "default",
    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
    display: "flex",
    flexDirection: "column",
  },
  cardInner: {
    flex: 1,
    paddingBottom: "16px",
  },
  cardTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "14px",
  },
  iconWrap: {
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  metricLabel: {
    fontSize: "11px",
    fontWeight: 500,
    color: T.subtleText,
    letterSpacing: "0.03em",
    textTransform: "uppercase",
    marginBottom: "6px",
    lineHeight: 1.3,
  },
  metricValue: {
    fontSize: "28px",
    fontWeight: 700,
    letterSpacing: "-0.03em",
    lineHeight: 1,
    color: T.brightText,
    fontVariantNumeric: "tabular-nums",
    marginBottom: "10px",
  },
  metricValueSmall: {
    fontSize: "22px",
  },
  bottomRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
  },
  changePill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "3px",
    fontSize: "11px",
    fontWeight: 600,
    borderRadius: "5px",
    padding: "3px 7px",
    letterSpacing: "0.01em",
  },
  compareText: {
    fontSize: "10.5px",
    color: T.mutedText,
    letterSpacing: "0.01em",
    textAlign: "right",
    lineHeight: 1.3,
  },
  progressTrack: {
    height: "3px",
    background: T.muted + "40",
    borderRadius: "0 0 12px 12px",
    overflow: "hidden",
    marginTop: "auto",
  },
  progressBar: {
    height: "100%",
    borderRadius: "0 0 12px 12px",
    transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
  },
  // Skeleton
  skeletonCard: {
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: "12px",
    padding: "18px 20px 16px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  skeletonLine: {
    borderRadius: "4px",
    background: `linear-gradient(90deg, ${T.border} 25%, #1E2D4A 50%, ${T.border} 75%)`,
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  },
  // Error / Empty
  stateCard: {
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: "12px",
    padding: "40px 24px",
    textAlign: "center",
    gridColumn: "1 / -1",
  },
  stateTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: T.primaryText,
    marginBottom: "6px",
  },
  stateDesc: {
    fontSize: "12px",
    color: T.subtleText,
    maxWidth: "300px",
    margin: "0 auto 16px",
    lineHeight: 1.5,
  },
  stateBtn: {
    fontSize: "12px",
    fontWeight: 500,
    color: T.blue,
    background: T.blueGlow,
    border: `1px solid ${T.blue}40`,
    borderRadius: "6px",
    padding: "6px 14px",
    cursor: "pointer",
  },
};

// ─── Mock Data Generator ──────────────────────────────────────────────────────
function generateMockData() {
  const totalOrders = Math.floor(Math.random() * 200) + 300;
  const newOrders = Math.floor(Math.random() * 30) + 15;
  const preparing = Math.floor(Math.random() * 40) + 20;
  const ready = Math.floor(Math.random() * 25) + 10;
  const delivered = Math.floor(Math.random() * 180) + 180;
  const cancelled = Math.floor(Math.random() * 20) + 8;
  const totalRevenue = (totalOrders * (Math.random() * 200 + 350)).toFixed(0);
  const aov = (totalRevenue / totalOrders).toFixed(0);

  const rand = (min, max) => +(Math.random() * (max - min) + min).toFixed(1);

  return {
    totalOrders: { value: totalOrders, change: rand(-8, 18), prev: totalOrders - Math.floor(rand(10, 30)) },
    newOrders: { value: newOrders, change: rand(-15, 25), prev: newOrders - Math.floor(rand(2, 8)) },
    preparing: { value: preparing, change: rand(-10, 12), prev: preparing - Math.floor(rand(3, 10)) },
    ready: { value: ready, change: rand(-20, 30), prev: ready - Math.floor(rand(2, 6)) },
    delivered: { value: delivered, change: rand(-5, 20), prev: delivered - Math.floor(rand(10, 30)) },
    cancelled: { value: cancelled, change: rand(-30, 15), prev: cancelled - Math.floor(rand(1, 5)) },
    totalRevenue: { value: +totalRevenue, change: rand(-10, 22), prev: +totalRevenue - Math.floor(rand(500, 2000)) },
    aov: { value: +aov, change: rand(-5, 10), prev: +aov - Math.floor(rand(5, 20)) },
  };
}

// ─── Card Config ──────────────────────────────────────────────────────────────
function getCardConfigs(data) {
  return [
    {
      key: "totalOrders",
      label: "Total Orders",
      icon: ShoppingBag,
      accent: T.blue,
      glow: T.blueGlow,
      value: data.totalOrders.value,
      change: data.totalOrders.change,
      prev: data.totalOrders.prev,
      format: "integer",
    },
    {
      key: "newOrders",
      label: "New Orders",
      icon: PackagePlus,
      accent: T.cyan,
      glow: T.cyanGlow,
      value: data.newOrders.value,
      change: data.newOrders.change,
      prev: data.newOrders.prev,
      format: "integer",
    },
    {
      key: "preparing",
      label: "Preparing",
      icon: ChefHat,
      accent: T.amber,
      glow: T.amberGlow,
      value: data.preparing.value,
      change: data.preparing.change,
      prev: data.preparing.prev,
      format: "integer",
    },
    {
      key: "ready",
      label: "Ready",
      icon: CheckCircle2,
      accent: T.emerald,
      glow: T.emeraldGlow,
      value: data.ready.value,
      change: data.ready.change,
      prev: data.ready.prev,
      format: "integer",
    },
    {
      key: "delivered",
      label: "Delivered",
      icon: Truck,
      accent: T.purple,
      glow: T.purpleGlow,
      value: data.delivered.value,
      change: data.delivered.change,
      prev: data.delivered.prev,
      format: "integer",
    },
    {
      key: "cancelled",
      label: "Cancelled",
      icon: XCircle,
      accent: T.rose,
      glow: T.roseGlow,
      value: data.cancelled.value,
      change: data.cancelled.change,
      prev: data.cancelled.prev,
      format: "integer",
      invertTrend: true,
    },
    {
      key: "totalRevenue",
      label: "Total Revenue",
      icon: DollarSign,
      accent: T.emerald,
      glow: T.emeraldGlow,
      value: data.totalRevenue.value,
      change: data.totalRevenue.change,
      prev: data.totalRevenue.prev,
      format: "currency",
    },
    {
      key: "aov",
      label: "Avg. Order Value",
      icon: BarChart3,
      accent: T.blue,
      glow: T.blueGlow,
      value: data.aov.value,
      change: data.aov.change,
      prev: data.aov.prev,
      format: "currency",
    },
  ];
}

// ─── Formatters ───────────────────────────────────────────────────────────────
function formatValue(value, format) {
  if (format === "currency") {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value.toLocaleString("en-IN")}`;
  }
  if (value >= 1000) return value.toLocaleString("en-IN");
  return String(value);
}

function formatPrev(value, format) {
  if (format === "currency") {
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
  }
  return String(value);
}

// ─── Shimmer CSS ──────────────────────────────────────────────────────────────
const shimmerCSS = `
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes spinOnce {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .fm-card-hover:hover {
    border-color: var(--card-accent) !important;
    background: var(--card-hover-bg) !important;
    transform: translateY(-2px);
    box-shadow: 0 8px 32px var(--card-glow), 0 0 0 0.5px var(--card-accent);
  }
  .fm-card-hover:hover .fm-card-glow-ring {
    opacity: 1 !important;
  }
  .fm-refresh-spin {
    animation: spinOnce 0.5s ease;
  }
`;

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={S.skeletonCard}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ ...S.skeletonLine, width: "34px", height: "34px", borderRadius: "8px" }} />
        <div style={{ ...S.skeletonLine, width: "52px", height: "20px" }} />
      </div>
      <div style={{ marginTop: "8px" }}>
        <div style={{ ...S.skeletonLine, width: "80px", height: "11px", marginBottom: "10px" }} />
        <div style={{ ...S.skeletonLine, width: "110px", height: "28px", marginBottom: "10px" }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ ...S.skeletonLine, width: "64px", height: "20px" }} />
          <div style={{ ...S.skeletonLine, width: "72px", height: "14px" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Single KPI Card ──────────────────────────────────────────────────────────
function KPICard({ config, maxValue, index }) {
  const { label, icon: Icon, accent, glow, value, change, prev, format, invertTrend } = config;

  const isPositive = invertTrend ? change <= 0 : change >= 0;
  const isNeutral = change === 0;

  const trendColor = isNeutral ? T.subtleText : isPositive ? T.emerald : T.rose;
  const trendBg = isNeutral ? T.muted + "30" : isPositive ? T.emeraldGlow : T.roseGlow;
  const TrendIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

  const progressPct = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0;
  const formattedValue = formatValue(value, format);
  const isLong = formattedValue.length >= 7;

  return (
    <div
      className="fm-card-hover"
      style={{
        ...S.card,
        "--card-accent": accent,
        "--card-glow": glow,
        "--card-hover-bg": T.cardHover,
        animation: `fadeInUp 0.35s ease both`,
        animationDelay: `${index * 40}ms`,
      }}
    >
      {/* Top glow ring — visible on hover */}
      <div
        className="fm-card-glow-ring"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          opacity: 0,
          transition: "opacity 0.2s ease",
          pointerEvents: "none",
        }}
      />

      <div style={S.cardInner}>
        <div style={S.cardTop}>
          {/* Icon */}
          <div style={{ ...S.iconWrap, background: glow }}>
            <Icon size={16} color={accent} strokeWidth={2} />
          </div>
          {/* Change pill */}
          <div style={{ ...S.changePill, color: trendColor, background: trendBg }}>
            <TrendIcon size={10} strokeWidth={2.5} />
            {Math.abs(change).toFixed(1)}%
          </div>
        </div>

        <div style={S.metricLabel}>{label}</div>
        <div
          style={{
            ...S.metricValue,
            ...(isLong ? S.metricValueSmall : {}),
            color: T.brightText,
          }}
        >
          {formattedValue}
        </div>

        <div style={S.bottomRow}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: accent,
                opacity: 0.7,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: "10.5px", color: T.mutedText, letterSpacing: "0.01em" }}>
              Live
            </span>
          </div>
          <div style={S.compareText}>
            vs {formatPrev(prev, format)} prev period
          </div>
        </div>
      </div>

      {/* Progress bar — signature element */}
      <div style={S.progressTrack}>
        <div
          style={{
            ...S.progressBar,
            width: `${progressPct}%`,
            background: `linear-gradient(90deg, ${accent}60, ${accent})`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────
function ErrorState({ onRetry }) {
  return (
    <div style={S.stateCard}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
        <div style={{ ...S.iconWrap, width: 44, height: 44, background: T.roseGlow, borderRadius: "10px" }}>
          <AlertTriangle size={20} color={T.rose} />
        </div>
      </div>
      <div style={S.stateTitle}>Failed to load order metrics</div>
      <div style={S.stateDesc}>
        There was a problem fetching order summary data. Check your connection or try again.
      </div>
      <button style={S.stateBtn} onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div style={S.stateCard}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
        <div style={{ ...S.iconWrap, width: 44, height: 44, background: T.blueGlow, borderRadius: "10px" }}>
          <ShoppingBag size={20} color={T.blue} />
        </div>
      </div>
      <div style={S.stateTitle}>No orders yet today</div>
      <div style={S.stateDesc}>
        Order metrics will appear here once your outlet starts receiving orders.
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OrderSummaryCards({
  outletName = "FoodMesh Central",
  period = "Today",
  autoRefreshMs = 0,
  simulateError = false,
  simulateEmpty = false,
}) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | success | error | empty
  const [spinning, setSpinning] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = useCallback(async () => {
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 900));
    if (simulateError) { setStatus("error"); return; }
    const d = generateMockData();
    const isEmpty = Object.values(d).every((m) => m.value === 0);
    if (simulateEmpty || isEmpty) { setStatus("empty"); return; }
    setData(d);
    setStatus("success");
    setLastUpdated(new Date());
  }, [simulateError, simulateEmpty]);

  const handleRefresh = async () => {
    setSpinning(true);
    await load();
    setTimeout(() => setSpinning(false), 500);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!autoRefreshMs) return;
    const id = setInterval(load, autoRefreshMs);
    return () => clearInterval(id);
  }, [autoRefreshMs, load]);

  // Compute max raw value for progress bars (count metrics only)
  const maxCount = data
    ? Math.max(
        data.totalOrders.value,
        data.newOrders.value,
        data.preparing.value,
        data.ready.value,
        data.delivered.value,
        data.cancelled.value
      )
    : 1;

  const cardConfigs = data ? getCardConfigs(data) : [];

  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div style={S.root}>
      <style>{shimmerCSS}</style>

      {/* Header */}
      <div style={S.header}>
        <div style={S.headerLeft}>
          <div style={S.sectionLabel}>
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: T.blue,
                display: "inline-block",
                boxShadow: `0 0 6px ${T.blue}`,
              }}
            />
            Order Analytics
          </div>
          <div style={S.sectionTitle}>Order Summary</div>
          <div style={S.sectionSub}>
            {outletName} · {period}
            {timeStr && (
              <span style={{ marginLeft: "8px", color: T.muted, fontSize: "11px" }}>
                · Updated {timeStr}
              </span>
            )}
          </div>
        </div>

        <div style={S.headerRight}>
          <div style={S.periodBadge}>{period}</div>
          <button
            style={S.refreshBtn}
            onClick={handleRefresh}
            disabled={status === "loading"}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = T.borderHover;
              e.currentTarget.style.color = T.primaryText;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = T.border;
              e.currentTarget.style.color = T.subtleText;
            }}
          >
            <RefreshCw
              size={11}
              className={spinning ? "fm-refresh-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Grid */}
      <div style={S.grid}>
        {status === "loading" &&
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}

        {status === "error" && <ErrorState onRetry={handleRefresh} />}

        {status === "empty" && <EmptyState />}

        {status === "success" &&
          cardConfigs.map((cfg, i) => (
            <KPICard
              key={cfg.key}
              config={cfg}
              maxValue={cfg.format === "currency" ? cfg.value : maxCount}
              index={i}
            />
          ))}
      </div>
    </div>
  );
}