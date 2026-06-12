import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import axiosInstance from "@/services/axios";

export default function AnalyticsPage() {
  const selectedOutlet = useSelector((state) => state.auth.selectedOutlet);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState("Month");

  const fetchOrders = useCallback(async () => {
    if (!selectedOutlet) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/orders?outletId=${selectedOutlet.id}&limit=100`);
      if (res.data && res.data.data && res.data.data.orders) {
        setOrders(res.data.data.orders);
      }
    } catch (err) {
      console.error("Failed to fetch analytics orders", err);
    } finally {
      setLoading(false);
    }
  }, [selectedOutlet]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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

  if (!selectedOutlet) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "calc(100vh - 92px)", color: "var(--text3)", gap: 10 }}>
        <div style={{ fontSize: 32 }}>🏪</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>No Active Outlet Selected</div>
        <div style={{ fontSize: 13, maxWidth: 300, textAlign: "center" }}>Please select an active outlet from the header dropdown to view performance analytics.</div>
      </div>
    );
  }

  // 1. Calculations for KPI Cards
  const finishedOrders = orders.filter(o => o.orderStatus === "DELIVERED" || o.orderStatus === "COMPLETED");
  const totalSales = finishedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const orderVolume = orders.length;
  const aov = orderVolume > 0 ? Math.round(totalSales / orderVolume) : 0;

  // 2. Calculations for Monthly/Trend chart
  // Group orders by month name (Jan - Dec)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyMap = {};
  orders.forEach(o => {
    if (o.createdAt) {
      const monthIdx = new Date(o.createdAt).getMonth();
      const name = monthNames[monthIdx];
      if (!monthlyMap[name]) {
        monthlyMap[name] = { sales: 0, orders: 0 };
      }
      monthlyMap[name].sales += o.totalAmount;
      monthlyMap[name].orders += 1;
    }
  });
  
  // Build month list starting from current month going back 6 months
  const currentMonthIdx = new Date().getMonth();
  const displayedMonths = [];
  for (let i = 5; i >= 0; i--) {
    const idx = (currentMonthIdx - i + 12) % 12;
    const name = monthNames[idx];
    displayedMonths.push({
      m: name,
      sales: monthlyMap[name]?.sales || 0,
      orders: monthlyMap[name]?.orders || 0,
    });
  }

  // 3. Calculations for Pie chart (Order Status)
  const finishedCount = finishedOrders.length;
  const preparingCount = orders.filter(o => o.orderStatus === "PREPARING").length;
  const pendingCount = orders.filter(o => o.orderStatus === "PENDING" || o.orderStatus === "ACCEPTED").length;
  const cancelledCount = orders.filter(o => o.orderStatus === "CANCELLED").length;
  const totalChartOrders = orderVolume || 1;
  const pieData = [
    { name: "Completed", value: Math.round((finishedCount / totalChartOrders) * 100), color: "#10b981" },
    { name: "Preparing", value: Math.round((preparingCount / totalChartOrders) * 100), color: "#f59e0b" },
    { name: "Pending", value: Math.round((pendingCount / totalChartOrders) * 100), color: "#3b82f6" },
    { name: "Cancelled", value: Math.round((cancelledCount / totalChartOrders) * 100), color: "#ef4444" },
  ];

  // 4. Calculations for Channel Performance
  const channelMap = { DINE_IN: 0, TAKEAWAY: 0, DELIVERY: 0, ONLINE: 0 };
  orders.forEach(o => {
    if (channelMap[o.source] !== undefined) {
      channelMap[o.source] += o.totalAmount;
    }
  });
  const channelsData = [
    { name: "Dine In", rev: channelMap.DINE_IN },
    { name: "Takeaway", rev: channelMap.TAKEAWAY },
    { name: "Delivery", rev: channelMap.DELIVERY },
    { name: "Online App", rev: channelMap.ONLINE },
  ];

  // 5. Calculations for Hourly Order Heatmap
  const hourMap = {};
  orders.forEach(o => {
    if (o.createdAt) {
      const hr = new Date(o.createdAt).getHours();
      const suffix = hr >= 12 ? "PM" : "AM";
      const displayHr = `${hr % 12 === 0 ? 12 : hr % 12}${suffix}`;
      hourMap[displayHr] = (hourMap[displayHr] || 0) + 1;
    }
  });
  const standardHours = ["8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM", "10PM"];
  const hourData = standardHours.map(h => ({
    h,
    orders: hourMap[h] || 0,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div className="page-header">
        <div className="header-row">
          <div>
            <div className="page-title">SaaS Performance Analytics</div>
            <div className="page-sub">Analyze restaurant sales, order channels performance, and operational bottlenecks for {selectedOutlet.name}.</div>
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn" onClick={fetchOrders}>Refresh Analytics</button>
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
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>Recalculating statistics…</div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { label: "Total Gross Sales", value: `₹${totalSales.toLocaleString()}`, change: "From settled payments", color: "var(--green)" },
              { label: "Order Volume", value: orderVolume.toString(), change: "All ticket counts", color: "var(--accent)" },
              { label: "AOV (Average Order Value)", value: `₹${aov}`, change: "Per ticket average", color: "var(--purple)" }
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
            <div className="chart-card" style={{ height: 260, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div className="section-header" style={{ marginBottom: 16 }}>
                <div className="section-title">Sales Revenue Performance Trend (Last 6 Months)</div>
                <div style={{ fontSize: 11, color: "var(--green)" }}>Compounded Monthly Growth</div>
              </div>
              
              <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={displayedMonths} margin={{ top: 5, right: 0, bottom: 0, left: -10 }}>
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
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", flex: 1 }}>
                <ResponsiveContainer width={130} height={130}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value">
                      {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {pieData.map((d) => (
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
                    data={channelsData}
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
                  <LineChart data={hourData} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
                    <XAxis dataKey="h" {...axisProps} />
                    <YAxis {...axisProps} />
                    <Tooltip {...tooltipStyle} />
                    <Line type="monotone" dataKey="orders" stroke="var(--purple)" strokeWidth={2} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
