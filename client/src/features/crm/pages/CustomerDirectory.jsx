import { useState, useEffect } from "react";
import axiosInstance from "@/services/axios";
import toast from "react-hot-toast";

export default function CustomerDirectory() {
  const [customers, setCustomers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Selected customer inspector state
  const [selectedCust, setSelectedCust] = useState(null);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Forms state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Address form state
  const [addrId, setAddrId] = useState(null); // for editing
  const [label, setLabel] = useState("Home");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/customers?search=${search}&page=${page}&limit=${limit}`
      );
      if (res.data && res.data.data) {
        setCustomers(res.data.data.customers || []);
        setTotalCount(res.data.data.pagination?.total || 0);

        // If inspecting, sync data
        if (selectedCust) {
          const fresh = res.data.data.customers.find((c) => c.id === selectedCust.id);
          if (fresh) setSelectedCust(fresh);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load customer list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search, page]);

  // CRUD Customer Actions
  const handleOpenCreate = () => {
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setShowCreateModal(true);
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!firstName || !phone) {
      toast.error("First name and phone number are required.");
      return;
    }
    const phoneRegex = /^\+?[\d\s\-().]{7,20}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    if (email) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address.");
        return;
      }
    }

    try {
      const res = await axiosInstance.post("/customers", {
        firstName,
        lastName,
        phone,
        email,
      });
      toast.success(res.data?.message || "Customer created successfully!");
      setShowCreateModal(false);
      fetchCustomers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create customer.");
    }
  };

  const handleOpenEdit = (cust) => {
    setFirstName(cust.firstName || "");
    setLastName(cust.lastName || "");
    setPhone(cust.phone || "");
    setEmail(cust.email || "");
    setShowEditModal(true);
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    if (!selectedCust) return;
    if (!firstName || !phone) {
      toast.error("First name and phone number are required.");
      return;
    }
    const phoneRegex = /^\+?[\d\s\-().]{7,20}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    if (email) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address.");
        return;
      }
    }

    try {
      await axiosInstance.put(`/customers/${selectedCust.id}`, {
        firstName,
        lastName,
        phone,
        email,
      });
      toast.success("Customer profile updated!");
      setShowEditModal(false);
      fetchCustomers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    try {
      await axiosInstance.delete(`/customers/${id}`);
      toast.success("Customer profile deleted.");
      if (selectedCust?.id === id) setSelectedCust(null);
      fetchCustomers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete customer.");
    }
  };

  // Address Actions
  const handleOpenAddress = (addr = null) => {
    if (addr) {
      setAddrId(addr._id || addr.id);
      setLabel(addr.label || "Home");
      setLine1(addr.line1 || "");
      setLine2(addr.line2 || "");
      setCity(addr.city || "");
      setStateName(addr.state || "");
      setPincode(addr.pincode || "");
    } else {
      setAddrId(null);
      setLabel("Home");
      setLine1("");
      setLine2("");
      setCity("");
      setStateName("");
      setPincode("");
    }
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!selectedCust) return;
    if (!line1 || !city || !stateName || !pincode) {
      toast.error("Please fill all required address fields.");
      return;
    }
    if (!/^\d{6}$/.test(pincode)) {
      toast.error("Pincode must be exactly 6 digits.");
      return;
    }

    const payload = {
      label,
      line1,
      line2: line2 || undefined,
      city,
      state: stateName,
      pincode,
      location: {
        type: "Point",
        coordinates: [77.4126, 23.2599], // Default coords
      },
    };

    try {
      if (addrId) {
        // Edit address
        await axiosInstance.patch(
          `/customers/${selectedCust.id}/addresses/${addrId}`,
          payload
        );
        toast.success("Address updated!");
      } else {
        // Add new address
        await axiosInstance.post(
          `/customers/${selectedCust.id}/addresses`,
          payload
        );
        toast.success("New address added!");
      }
      setShowAddressModal(false);
      fetchCustomers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save address details.");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!selectedCust || !confirm("Delete this address?")) return;
    try {
      await axiosInstance.delete(
        `/customers/${selectedCust.id}/addresses/${addressId}`
      );
      toast.success("Address deleted.");
      fetchCustomers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete address.");
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="header-row">
          <div>
            <div className="page-title">Customer CRM Directory</div>
            <div className="page-sub">
              Manage client records, contact indexes, order stats, and address books.
            </div>
          </div>
          <button className="btn primary" onClick={handleOpenCreate}>
            + Create Customer
          </button>
        </div>
      </div>

      {/* Main split display */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: selectedCust ? "1.4fr 1fr" : "1fr",
          gap: 20,
        }}
      >
        {/* Customer Listing Section */}
        <div
          style={{
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Controls */}
          <div style={{ display: "flex", gap: 12 }}>
            <input
              placeholder="Search by name, phone, or email…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="btn"
              style={{
                flex: 1,
                background: "var(--bg3)",
                color: "var(--text)",
                outline: "none",
                textAlign: "left",
              }}
            />
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--border)",
                    textAlign: "left",
                  }}
                >
                  <th style={{ padding: "10px 8px", fontSize: 11, color: "var(--text3)" }}>
                    NAME
                  </th>
                  <th style={{ padding: "10px 8px", fontSize: 11, color: "var(--text3)" }}>
                    CONTACT INFO
                  </th>
                  <th
                    style={{
                      padding: "10px 8px",
                      fontSize: 11,
                      color: "var(--text3)",
                      textAlign: "center",
                    }}
                  >
                    ORDERS
                  </th>
                  <th
                    style={{
                      padding: "10px 8px",
                      fontSize: 11,
                      color: "var(--text3)",
                      textAlign: "right",
                    }}
                  >
                    TOTAL SPENT
                  </th>
                  <th
                    style={{
                      padding: "10px 8px",
                      fontSize: 11,
                      color: "var(--text3)",
                      textAlign: "right",
                    }}
                  >
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>
                      Loading customer directory…
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>
                      No customers found matching search filters.
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCust(c)}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        cursor: "pointer",
                        background: selectedCust?.id === c.id ? "rgba(59,130,246,0.06)" : "none",
                      }}
                      className="hover:bg-slate-800/10"
                    >
                      <td style={{ padding: "12px 8px", fontWeight: 600 }}>{c.fullName}</td>
                      <td style={{ padding: "12px 8px" }}>
                        <div style={{ fontSize: 12.5 }}>{c.phone}</div>
                        {c.email && (
                          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
                            {c.email}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "12px 8px", textAlign: "center" }}>
                        {c.totalOrders || 0}
                      </td>
                      <td style={{ padding: "12px 8px", textAlign: "right", fontWeight: 700 }}>
                        ₹{(c.totalSpent || 0).toLocaleString()}
                      </td>
                      <td
                        style={{ padding: "12px 8px", textAlign: "right" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                          <button
                            className="btn"
                            onClick={() => handleOpenEdit(c)}
                            style={{ padding: "4px 8px", fontSize: 11 }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn"
                            onClick={() => handleDeleteCustomer(c.id)}
                            style={{ padding: "4px 8px", fontSize: 11, color: "var(--red)" }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
              <span style={{ fontSize: 12, color: "var(--text3)" }}>
                Showing page {page} of {totalPages}
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  className="btn"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Prev
                </button>
                <button
                  className="btn"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Selected Customer Inspector Panel */}
        {selectedCust && (
          <div
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* Title & Close */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{selectedCust.fullName}</div>
                <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>
                  Joined: {new Date(selectedCust.createdAt).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => setSelectedCust(null)}
                style={{
                  background: "var(--bg3)",
                  border: "1px solid var(--border)",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "var(--text3)",
                }}
              >
                ✕
              </button>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

            {/* Quick Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "var(--bg3)", padding: 10, borderRadius: 8, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>TOTAL SPENT</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--accent)", marginTop: 4 }}>
                  ₹{(selectedCust.totalSpent || 0).toLocaleString()}
                </div>
              </div>
              <div style={{ background: "var(--bg3)", padding: 10, borderRadius: 8, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>ORDERS PLACED</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--green)", marginTop: 4 }}>
                  {selectedCust.totalOrders || 0}
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div>
              <div style={{ fontWeight: 600, fontSize: 12, color: "var(--text3)", marginBottom: 8 }}>
                CONTACT CARD
              </div>
              <div style={{ background: "var(--bg3)", padding: 12, borderRadius: 8, border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontSize: 12.5 }}>
                  <span style={{ color: "var(--text3)" }}>Phone:</span> {selectedCust.phone}
                </div>
                <div style={{ fontSize: 12.5 }}>
                  <span style={{ color: "var(--text3)" }}>Email:</span> {selectedCust.email || "N/A"}
                </div>
              </div>
            </div>

            {/* Address Directory */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 600, fontSize: 12, color: "var(--text3)" }}>
                  ADDRESS BOOK
                </div>
                <button
                  className="btn primary"
                  onClick={() => handleOpenAddress()}
                  style={{ padding: "3px 8px", fontSize: 10 }}
                >
                  + Add Address
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(!selectedCust.address || selectedCust.address.length === 0) ? (
                  <div style={{ padding: 16, textAlign: "center", color: "var(--text3)", background: "var(--bg3)", border: "1px dashed var(--border)", borderRadius: 8, fontSize: 12 }}>
                    No addresses recorded.
                  </div>
                ) : (
                  selectedCust.address.map((addr) => (
                    <div
                      key={addr._id || addr.id}
                      style={{
                        background: "var(--bg3)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        padding: 12,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span className="badge badge-gray" style={{ width: "fit-content", fontSize: 9, padding: "2px 6px" }}>
                          {addr.label?.toUpperCase() || "ADDRESS"}
                        </span>
                        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", marginTop: 2 }}>
                          {addr.line1}
                          {addr.line2 ? `, ${addr.line2}` : ""}
                        </div>
                        <div style={{ fontSize: 11.5, color: "var(--text3)" }}>
                          {addr.city}, {addr.state} - {addr.pincode}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          onClick={() => handleOpenAddress(addr)}
                          style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 10, cursor: "pointer" }}
                        >
                          Edit
                        </button>
                        <span style={{ color: "var(--border)" }}>|</span>
                        <button
                          onClick={() => handleDeleteAddress(addr._id || addr.id)}
                          style={{ background: "none", border: "none", color: "var(--red)", fontSize: 10, cursor: "pointer" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CREATE CUSTOMER MODAL */}
      {showCreateModal && (
        <div className="pos-modal-overlay">
          <div className="pos-modal">
            <div className="pos-modal-header">
              <span>Create Customer</span>
              <button onClick={() => setShowCreateModal(false)} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer" }}>✕</button>
            </div>
            <form onSubmit={handleCreateCustomer}>
              <div className="pos-modal-body">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 11, color: "var(--text3)" }}>First Name *</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="btn" style={{ background: "var(--bg3)", color: "var(--text)", textAlign: "left" }} required />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 11, color: "var(--text3)" }}>Last Name</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="btn" style={{ background: "var(--bg3)", color: "var(--text)", textAlign: "left" }} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={{ fontSize: 11, color: "var(--text3)" }}>Phone Number *</label>
                  <input type="text" placeholder="+91..." value={phone} onChange={(e) => setPhone(e.target.value)} className="btn" style={{ background: "var(--bg3)", color: "var(--text)", textAlign: "left" }} required />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={{ fontSize: 11, color: "var(--text3)" }}>Email Address</label>
                  <input type="email" placeholder="example@foodmesh.com" value={email} onChange={(e) => setEmail(e.target.value)} className="btn" style={{ background: "var(--bg3)", color: "var(--text)", textAlign: "left" }} />
                </div>
              </div>
              <div className="pos-modal-footer">
                <button type="button" className="btn" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn primary">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CUSTOMER MODAL */}
      {showEditModal && (
        <div className="pos-modal-overlay">
          <div className="pos-modal">
            <div className="pos-modal-header">
              <span>Edit Customer Profile</span>
              <button onClick={() => setShowEditModal(false)} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer" }}>✕</button>
            </div>
            <form onSubmit={handleUpdateCustomer}>
              <div className="pos-modal-body">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 11, color: "var(--text3)" }}>First Name *</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="btn" style={{ background: "var(--bg3)", color: "var(--text)", textAlign: "left" }} required />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 11, color: "var(--text3)" }}>Last Name</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="btn" style={{ background: "var(--bg3)", color: "var(--text)", textAlign: "left" }} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={{ fontSize: 11, color: "var(--text3)" }}>Phone Number *</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="btn" style={{ background: "var(--bg3)", color: "var(--text)", textAlign: "left" }} required />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={{ fontSize: 11, color: "var(--text3)" }}>Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="btn" style={{ background: "var(--bg3)", color: "var(--text)", textAlign: "left" }} />
                </div>
              </div>
              <div className="pos-modal-footer">
                <button type="button" className="btn" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADDRESS FORM MODAL */}
      {showAddressModal && (
        <div className="pos-modal-overlay">
          <div className="pos-modal">
            <div className="pos-modal-header">
              <span>{addrId ? "Edit Address Details" : "Add Customer Address"}</span>
              <button onClick={() => setShowAddressModal(false)} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer" }}>✕</button>
            </div>
            <form onSubmit={handleSaveAddress}>
              <div className="pos-modal-body">
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={{ fontSize: 11, color: "var(--text3)" }}>Label *</label>
                  <select value={label} onChange={(e) => setLabel(e.target.value)} className="btn" style={{ background: "var(--bg3)", color: "var(--text)", textAlign: "left", width: "100%" }}>
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={{ fontSize: 11, color: "var(--text3)" }}>Address Line 1 *</label>
                  <input type="text" placeholder="House/Flat No, Apartment, Street" value={line1} onChange={(e) => setLine1(e.target.value)} className="btn" style={{ background: "var(--bg3)", color: "var(--text)", textAlign: "left" }} required />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={{ fontSize: 11, color: "var(--text3)" }}>Address Line 2</label>
                  <input type="text" placeholder="Area, Landmark" value={line2} onChange={(e) => setLine2(e.target.value)} className="btn" style={{ background: "var(--bg3)", color: "var(--text)", textAlign: "left" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 11, color: "var(--text3)" }}>City *</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="btn" style={{ background: "var(--bg3)", color: "var(--text)", textAlign: "left" }} required />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 11, color: "var(--text3)" }}>State *</label>
                    <input type="text" value={stateName} onChange={(e) => setStateName(e.target.value)} className="btn" style={{ background: "var(--bg3)", color: "var(--text)", textAlign: "left" }} required />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={{ fontSize: 11, color: "var(--text3)" }}>Pincode (6 Digits) *</label>
                  <input type="text" maxLength={6} placeholder="e.g. 462021" value={pincode} onChange={(e) => setPincode(e.target.value)} className="btn" style={{ background: "var(--bg3)", color: "var(--text)", textAlign: "left" }} required />
                </div>
              </div>
              <div className="pos-modal-footer">
                <button type="button" className="btn" onClick={() => setShowAddressModal(false)}>Cancel</button>
                <button type="submit" className="btn primary">Save Address</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
