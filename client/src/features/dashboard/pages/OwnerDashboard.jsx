import { useState, useEffect } from "react";
import axiosInstance from "@/services/axios";
import toast from "react-hot-toast";

export default function OwnerDashboard() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brandName, setBrandName] = useState("");
  const [gstNumber, setGstNumber] = useState("");

  const [outlets, setOutlets] = useState([
    { id: "O1", name: "Indrapuri Sector C", address: "Bhopal, MP", status: "Active", contact: "9876543210" },
    { id: "O2", name: "MP Nagar Zone II", address: "Bhopal, MP", status: "Active", contact: "9876543211" },
    { id: "O3", name: "Arera Colony", address: "Bhopal, MP", status: "Inactive", contact: "9876543212" },
  ]);

  const fetchRestaurant = async () => {
    try {
      // Get all restaurants for this tenant
      const response = await axiosInstance.get("/restaurants");
      if (response.data.restaurants && response.data.restaurants.length > 0) {
        const rest = response.data.restaurants[0];
        setRestaurant(rest);
        setName(rest.name || "");
        setDescription(rest.description || "");
        setBrandName(rest.brandName || "");
        setGstNumber(rest.gstNumber || "");
      }
    } catch (error) {
      console.error("Failed to load restaurant details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      fetchRestaurant();
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const handleUpdateRestaurant = async (e) => {
    e.preventDefault();
    if (!restaurant) {
      // Let's create one
      try {
        await axiosInstance.post("/restaurants", {
          name, description, brandName, gstNumber
        });
        toast.success("Restaurant profile created!");
        fetchRestaurant();
      } catch (err) {
        console.error("Failed to create restaurant profile", err);
        toast.error("Failed to create restaurant profile.");
      }
      return;
    }

    try {
      await axiosInstance.patch(`/restaurants/${restaurant._id}`, {
        name, description, brandName, gstNumber
      });
      toast.success("Restaurant profile updated!");
      fetchRestaurant();
    } catch (error) {
      console.error("Failed to update restaurant", error);
      toast.error("Failed to update restaurant details.");
    }
  };

  const toggleOutletStatus = (id) => {
    setOutlets(prev => 
      prev.map(o => o.id === id ? { ...o, status: o.status === "Active" ? "Inactive" : "Active" } : o)
    );
    toast.success("Outlet status toggled!");
  };

  if (loading) {
    return <div style={{ color: "var(--text3)", textAlign: "center", padding: 40 }}>Loading Restaurant Profile...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div className="page-header">
        <div className="header-row">
          <div>
            <div className="page-title">Restaurant settings</div>
            <div className="page-sub">Configure business profiles, brand details, tax codes, and manage store outlets.</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Profile Details Form */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Business Profile</div>
          
          <form onSubmit={handleUpdateRestaurant} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, color: "var(--text2)", fontWeight: 600 }}>Restaurant Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="btn" 
                style={{ background: "var(--bg3)", color: "var(--text)", outline: "none", width: "100%", textAlign: "left" }} 
                required 
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, color: "var(--text2)", fontWeight: 600 }}>Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="btn" 
                style={{ background: "var(--bg3)", color: "var(--text)", outline: "none", width: "100%", minHeight: 60, textAlign: "left" }} 
                required 
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, color: "var(--text2)", fontWeight: 600 }}>Brand Name</label>
              <input 
                type="text" 
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="btn" 
                style={{ background: "var(--bg3)", color: "var(--text)", outline: "none", width: "100%", textAlign: "left" }} 
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, color: "var(--text2)", fontWeight: 600 }}>GST / Tax Registration Number</label>
              <input 
                type="text" 
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                className="btn" 
                style={{ background: "var(--bg3)", color: "var(--text)", outline: "none", width: "100%", textAlign: "left" }} 
              />
            </div>

            <button type="submit" className="btn primary" style={{ width: "fit-content", padding: "8px 16px", marginTop: 8 }}>
              {restaurant ? "Update Settings" : "Create Profile"}
            </button>
          </form>
        </div>

        {/* Store Outlets List */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Active Outlets</div>
            <button className="btn primary" onClick={() => toast.success("New outlet wizard started!")}>+ Add Outlet</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {outlets.map((o) => (
              <div 
                key={o.id} 
                style={{ 
                  background: "var(--bg3)", 
                  border: "1px solid var(--border)", 
                  borderRadius: 8, 
                  padding: 12, 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center" 
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{o.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text3)", marginTop: 2 }}>{o.address} · Contact: {o.contact}</div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span className={`badge ${o.status === "Active" ? "badge-green" : "badge-gray"}`}>
                    {o.status}
                  </span>
                  <button className="btn" onClick={() => toggleOutletStatus(o.id)} style={{ padding: "4px 8px", fontSize: 11 }}>
                    Toggle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
