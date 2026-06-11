import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { HOUR_DATA, PIE_DATA, CHANNELS } from "../../../data/data";

const monthlySalesData = [
  { m: "Jan", sales: 120000, orders: 420 },
  { m: "Feb", sales: 180000, orders: 580 },
  { m: "Mar", sales: 150000, orders: 490 },
  { m: "Apr", sales: 220000, orders: 710 },
  { m: "May", sales: 290000, orders: 950 },
  { m: "Jun", sales: 340000, orders: 1100 },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("Month");

  const axisProps = {
    style: { fontSize: 10, fill: "var(--text3)" },
    axisLine: false,
    tickLine: false,
  };

  const tooltipStyle = {
    contentStyle: {
      background: "var(--bg3)", border: "1px solid var(--border)",
      borderRadius: 6, fontSize: 11, color: "var(--text)",
    },
    labelStyle: { color: "var(--text2)" },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div className="page-header">
        <div className="header-row">
          <div>
            <div className="page-title">SaaS Performance Analytics</div>
            <div className="page-sub">Analyze restaurant sales, order channels performance, and operational bottlenecks.</div>
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            {["Day", "Week", "Month", "Year"].map(p => (
              <button 
                key={p} 
                className={`btn${period === p ? " primary" : ""}`}
                onClick={() => setPeriod(p)}
                style={{ fontSize: 11, padding: "5px 10px" }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Sales Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { label: "Total Gross Sales", value: "₹3,40,000", change: "+14.2% vs prev", color: "var(--green)" },
          { label: "Order Volume", value: "1,100", change: "+8.3% vs prev", color: "var(--accent)" },
          { label: "AOV (Average Order Value)", value: "₹309", change: "+5.4% vs prev", color: "var(--purple)" }
        ].map((c, idx) => (
          <div key={idx} className="kpi-card">
            <span className="kpi-label" style={{ display: "block", color: "var(--text3)", fontSize: 10.5 }}>{c.label}</span>
            <span style={{ display: "block", fontSize: 24, fontWeight: 700, margin: "6px 0", color: c.color }}>{c.value}</span>
            <span style={{ fontSize: 11, color: "var(--text2)" }}>{c.change}</span>
          </div>
        ))}
      </div>

      {/* Analytics Charts Grid */}
      <div className="charts-grid" style={{ gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
        {/* Sales Performance Trend */}
        <div className="chart-card" style={{ height: 260, display: "flex", flexDirection: "column", justifyBetween: "space-between" }}>
          <div className="section-header" style={{ marginBottom: 16 }}>
            <div className="section-title">Sales Revenue Performance Trend</div>
            <div style={{ fontSize: 11, color: "var(--green)" }}>Compounded Monthly Growth: +14%</div>
          </div>
          
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySalesData} margin={{ top: 5, right: 0, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="salesTrendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" {...axisProps} />
                <YAxis {...axisProps} />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} fill="url(#salesTrendGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="chart-card" style={{ height: 260, display: "flex", flexDirection: "column" }}>
          <div className="section-header" style={{ marginBottom: 12 }}>
            <div className="section-title">Order Status Summary</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justify: "space-around", flex: 1 }}>
            <ResponsiveContainer width={130} height={130}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value">
                  {PIE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {PIE_DATA.map((d) => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color }} />
                  <span style={{ color: "var(--text2)", minWidth: 80 }}>{d.name}</span>
                  <span style={{ fontWeight: 600 }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="charts-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Channel Revenue Performance */}
        <div className="chart-card" style={{ height: 240, display: "flex", flexDirection: "column" }}>
          <div className="section-header" style={{ marginBottom: 12 }}>
            <div className="section-title">Revenue Channels Performance</div>
          </div>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={CHANNELS.map((c) => ({ name: c.name, rev: parseFloat(c.rev.replace(/[₹L]/g, "")) }))}
                margin={{ top: 5, right: 0, bottom: 0, left: -20 }}
              >
                <XAxis dataKey="name" {...axisProps} />
                <YAxis {...axisProps} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="rev" fill="var(--accent)" opacity={0.8} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Volume Trend */}
        <div className="chart-card" style={{ height: 240, display: "flex", flexDirection: "column" }}>
          <div className="section-header" style={{ marginBottom: 12 }}>
            <div className="section-title">Daily Hourly Order Heatmap</div>
          </div>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HOUR_DATA} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
                <XAxis dataKey="h" {...axisProps} />
                <YAxis {...axisProps} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="orders" stroke="var(--purple)" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
