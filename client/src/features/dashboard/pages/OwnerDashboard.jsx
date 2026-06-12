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

  // Change password fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const [outlets, setOutlets] = useState([]);

  const fetchOutlets = async () => {
    try {
      const response = await axiosInstance.get("/outlets");
      if (response.data && response.data.data && response.data.data.outlets) {
        setOutlets(response.data.data.outlets);
      }
    } catch (error) {
      console.error("Failed to load outlets", error);
    }
  };

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
        fetchOutlets();
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

    // Validate GST number format if provided
    if (gstNumber && gstNumber.trim() !== "") {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
      if (!gstRegex.test(gstNumber.trim())) {
        toast.error("Please provide a valid Indian GST number (e.g. 22AAAAA0000A1Z5) or leave it empty.");
        return;
      }
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      brandName: brandName.trim() || undefined,
      gstNumber: gstNumber && gstNumber.trim() !== "" ? gstNumber.trim().toUpperCase() : undefined
    };

    if (!restaurant) {
      // Let's create one
      try {
        await axiosInstance.post("/restaurants", payload);
        toast.success("Restaurant profile created!");
        fetchRestaurant();
      } catch (err) {
        console.error("Failed to create restaurant profile", err);
        toast.error("Failed to create restaurant profile.");
      }
      return;
    }

    try {
      await axiosInstance.patch(`/restaurants/${restaurant._id}`, payload);
      toast.success("Restaurant profile updated!");
      fetchRestaurant();
    } catch (error) {
      console.error("Failed to update restaurant", error);
      toast.error("Failed to update restaurant details.");
    }
  };

  const toggleOutletStatus = async (id, currentStatus) => {
    try {
      const nextStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await axiosInstance.patch(`/outlets/${id}/status`, {
        status: nextStatus
      });
      toast.success("Outlet status toggled!");
      fetchOutlets();
    } catch (error) {
      console.error("Failed to toggle outlet status", error);
      toast.error("Failed to update status.");
    }
  };

  const handleAddOutlet = async () => {
    if (!restaurant) {
      toast.error("Please create a restaurant profile first.");
      return;
    }
    try {
      const name = prompt("Enter Outlet Name:", "Indrapuri Sector C");
      if (!name) return;
      const address = prompt("Enter Address:", "Bhopal, MP");
      if (!address) return;
      const pincode = prompt("Enter Pincode (6 digits):", "462021");
      if (!pincode) return;

      await axiosInstance.post("/outlets", {
        restaurantId: restaurant._id,
        name,
        address,
        city: "Bhopal",
        state: "MP",
        pincode,
        phone: "9876543210",
        email: "store@foodmesh.com",
        location: {
          coordinates: [77.4126, 23.2599]
        }
      });
      toast.success("New outlet created!");
      fetchOutlets();
    } catch (error) {
      console.error("Failed to create outlet", error);
      toast.error(error.response?.data?.message || "Failed to create outlet.");
    }
  };
  
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setUpdatingPassword(true);
    const loadingToast = toast.loading("Updating password...");
    try {
      await axiosInstance.post("/auth/change-password", {
        oldPassword,
        newPassword,
        confirmPassword
      });
      toast.dismiss(loadingToast);
      toast.success("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to update password.");
    } finally {
      setUpdatingPassword(false);
    }
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
        {/* Left Column - Profile Settings & Security */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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

          {/* Change Password Form */}
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Security & Password</div>
            
            <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 11, color: "var(--text2)", fontWeight: 600 }}>Current Password</label>
                <input 
                  type="password" 
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="btn" 
                  style={{ background: "var(--bg3)", color: "var(--text)", outline: "none", width: "100%", textAlign: "left" }} 
                  required 
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 11, color: "var(--text2)", fontWeight: 600 }}>New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="btn" 
                  style={{ background: "var(--bg3)", color: "var(--text)", outline: "none", width: "100%", textAlign: "left" }} 
                  required 
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 11, color: "var(--text2)", fontWeight: 600 }}>Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="btn" 
                  style={{ background: "var(--bg3)", color: "var(--text)", outline: "none", width: "100%", textAlign: "left" }} 
                  required 
                />
              </div>

              <button type="submit" className="btn primary" disabled={updatingPassword} style={{ width: "fit-content", padding: "8px 16px", marginTop: 8 }}>
                {updatingPassword ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Store Outlets List */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifycontent: "space-between", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Active Outlets</div>
            <button className="btn primary" onClick={handleAddOutlet}>+ Add Outlet</button>
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
                  <div style={{ fontSize: 11.5, color: "var(--text3)", marginTop: 2 }}>{o.address} · Contact: {o.phone || "N/A"}</div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span className={`badge ${o.status === "ACTIVE" ? "badge-green" : "badge-gray"}`}>
                    {o.status === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                  <button className="btn" onClick={() => toggleOutletStatus(o.id, o.status)} style={{ padding: "4px 8px", fontSize: 11 }}>
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
