import axiosInstance from "@/services/axios";

export const getDashboardMetrics = async () => {
  try {
    const response = await axiosInstance.get("/dashboard/metrics");
    return response.data;
  } catch (error) {
    console.warn("Using dashboard service mock fallback", error);
    // Fallback Mock data for dashboard
    return {
      stats: {
        totalRevenue: 542900,
        activeOrders: 14,
        avgTicket: 1450,
        cancelRate: 2.1,
        tableTurnover: 42,
        occupancy: 78
      },
      kitchenLoad: [
        { name: "Grill Station", pct: 78, color: "#f59e0b" },
        { name: "Tandoor",       pct: 92, color: "#ef4444" },
        { name: "Cold Kitchen",  pct: 45, color: "#10b981" },
        { name: "Desserts",      pct: 30, color: "#10b981" }
      ],
      staffAttendance: [
        { name: "Rajesh K.", role: "Chef",     util: "92%", color: "#ef4444" },
        { name: "Priti M.",  role: "Chef",     util: "78%", color: "#f59e0b" },
        { name: "Suresh L.", role: "Packing",  util: "65%", color: "#10b981" },
        { name: "Amit V.",   role: "Delivery", util: "40%", color: "#10b981" }
      ],
      inventoryRisks: [
        { item: "Paneer",    pct: 15, color: "#ef4444" },
        { item: "Chicken",   pct: 42, color: "#f59e0b" },
        { item: "Naan dough",pct: 67, color: "#10b981" },
        { item: "Butter",    pct: 23, color: "#ef4444" }
      ],
      channels: [
        { id: "swiggy",   name: "Swiggy",   orders: 142, rev: "₹1.84L", avg: "₹1,295", growth: "+12%", up: true,  live: true  },
        { id: "zomato",   name: "Zomato",   orders: 198, rev: "₹2.31L", avg: "₹1,167", growth: "+8%",  up: true,  live: true  },
        { id: "ondc",     name: "ONDC",     orders: 67,  rev: "₹0.82L", avg: "₹1,224", growth: "+24%", up: true,  live: true  },
        { id: "website",  name: "Website",  orders: 89,  rev: "₹1.47L", avg: "₹1,652", growth: "+32%", up: true,  live: true  },
        { id: "app",      name: "App",      orders: 114, rev: "₹1.92L", avg: "₹1,684", growth: "+18%", up: true,  live: true  },
        { id: "whatsapp", name: "WhatsApp", orders: 43,  rev: "₹0.63L", avg: "₹1,465", growth: "+41%", up: true,  live: true  }
      ],
      aiRecommendations: [
        { type: "alert", icon: "⚠",  text: "Paneer inventory likely to run out in ~2 hours. Place order now." },
        { type: "warn",  icon: "👥", text: "Additional kitchen staff recommended. Order volume up 28% vs last Thursday." },
        { type: "info",  icon: "📈", text: "Website orders increased 32% today. Review packaging stock." },
        { type: "warn",  icon: "⏱", text: "Avg prep time for Zomato orders is 4 min above SLA. Prioritize kitchen flow." },
        { type: "info",  icon: "💡", text: "Peak hour predicted at 8PM. Load expected 18% above capacity." }
      ]
    };
  }
};