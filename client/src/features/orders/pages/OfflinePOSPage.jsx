import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import POSMenuGrid from "../component/POSMenuGrid";
import axiosInstance from "@/services/axios";
import toast from "react-hot-toast";

export default function OfflinePOSPage() {
  const selectedOutlet = useSelector((state) => state.auth.selectedOutlet);

  const [categories, setCategories] = useState([{ id: "All", name: "All" }]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  
  // Customization modal state
  const [customizingItem, setCustomizingItem] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  
  // Discount percentage
  const [discount, setDiscount] = useState(0);
  const [checkingOut, setCheckingOut] = useState(false);

  // Fetch categories when outlet changes
  useEffect(() => {
    if (!selectedOutlet) return;
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get(`/categories?outletId=${selectedOutlet.id}`);
        if (res.data && res.data.data && res.data.data.categories) {
          setCategories([{ id: "All", name: "All" }, ...res.data.data.categories]);
          setSelectedCategory("All");
        }
      } catch (err) {
        console.error("Failed to load categories for POS page", err);
      }
    };
    fetchCategories();
  }, [selectedOutlet]);

  // Fetch complete item details (including variants/addons) on selection
  const handleSelectItem = async (item) => {
    const loadingToast = toast.loading("Loading customizations…");
    try {
      const res = await axiosInstance.get(`/menu-items/${item.id}`);
      toast.dismiss(loadingToast);
      if (res.data && res.data.data) {
        const itemDetails = res.data.data;
        const hasVariants = itemDetails.variants && itemDetails.variants.length > 0;
        const hasAddons = itemDetails.addons && itemDetails.addons.length > 0;

        if (hasVariants || hasAddons) {
          setCustomizingItem(itemDetails);
          setSelectedVariant(hasVariants ? itemDetails.variants[0] : null);
          setSelectedAddons([]);
        } else {
          addToCart(itemDetails, null, []);
        }
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("Failed to load item details", err);
      // Fallback directly to cart using basic item properties
      addToCart(item, null, []);
    }
  };

  const addToCart = (item, variant, addons) => {
    const variantId = variant ? variant.id : "base";
    const addonIds = addons.map((a) => a.id).sort().join("-");
    const cartItemId = `${item.id}-${variantId}-${addonIds}`;
    
    // Addon pricing
    const addonsPrice = addons.reduce((sum, a) => sum + a.price, 0);
    const itemUnitPrice = (variant ? variant.price : item.price) + addonsPrice;

    // Display Name building
    const displayName = `${item.name}${variant ? ` (${variant.name})` : ""}${
      addons.length ? ` + ${addons.map((a) => a.name).join(", ")}` : ""
    }`;

    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci.cartItemId === cartItemId);
      if (existing) {
        return prevCart.map((ci) => 
          ci.cartItemId === cartItemId ? { ...ci, qty: ci.qty + 1 } : ci
        );
      }
      return [
        ...prevCart,
        {
          cartItemId,
          id: item.id,
          name: displayName,
          basePrice: item.price,
          unitPrice: itemUnitPrice,
          qty: 1,
          variant,
          addons,
        }
      ];
    });
    
    toast.success(`${item.name} added to cart!`);
  };

  const handleCustomizationSubmit = () => {
    addToCart(customizingItem, selectedVariant, selectedAddons);
    setCustomizingItem(null);
  };

  const updateQty = (cartItemId, change) => {
    setCart((prevCart) => 
      prevCart.map((ci) => {
        if (ci.cartItemId === cartItemId) {
          const newQty = ci.qty + change;
          return newQty > 0 ? { ...ci, qty: newQty } : null;
        }
        return ci;
      }).filter(Boolean)
    );
  };

  // Billing math
  const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const gst = taxableAmount * 0.05; // 5% GST
  const total = taxableAmount + gst;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty!");
      return;
    }

    setCheckingOut(true);
    const loadingToast = toast.loading("Processing checkout...");

    try {
      // 1. Create or upsert a Walk-in Customer record
      const customerRes = await axiosInstance.post("/customers", {
        firstName: "Walk-in",
        lastName: "Customer",
        phone: "9999999999",
      });

      const customerId = customerRes.data?.data?.id;
      if (!customerId) {
        throw new Error("Failed to resolve customer ID from backend");
      }

      // 2. Place Order
      const orderPayload = {
        outletId: selectedOutlet.id,
        customerId: customerId,
        source: "TAKEAWAY",
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(gst.toFixed(2)),
        discount: parseFloat(discountAmount.toFixed(2)),
        totalAmount: parseFloat(total.toFixed(2)),
        items: cart.map((item) => ({
          menuItemId: item.id,
          name: item.name,
          quantity: item.qty,
          unitPrice: item.unitPrice,
          variantId: item.variant?.id || undefined,
          addons: item.addons?.map((a) => ({
            addonId: a.id,
            name: a.name,
            price: a.price,
          })) || [],
        })),
      };

      const orderRes = await axiosInstance.post("/orders", orderPayload);
      const orderId = orderRes.data?.data?.id;
      const orderNumber = orderRes.data?.data?.orderNumber;
      if (!orderId) {
        throw new Error("Failed to place order on backend");
      }

      // 3. Process payment
      await axiosInstance.post("/payments", {
        orderId: orderId,
        transactionId: `TXN-POS-${Date.now()}`,
        paymentMethod: "COD",
        amount: parseFloat(total.toFixed(2)),
      });

      // 4. Update status to ACCEPTED
      try {
        await axiosInstance.patch(`/orders/${orderId}/status`, {
          orderStatus: "ACCEPTED",
        });
      } catch (err) {
        console.warn("Failed to automatically update order status to ACCEPTED", err);
      }

      toast.dismiss(loadingToast);
      toast.success(`Order #${orderNumber || ""} settled and placed!`);
      setCart([]);
      setDiscount(0);
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Checkout failed");
    } finally {
      setCheckingOut(false);
    }
  };

  if (!selectedOutlet) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "calc(100vh - 92px)", color: "var(--text3)", gap: 10 }}>
        <div style={{ fontSize: 32 }}>🏪</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>No Active Outlet Selected</div>
        <div style={{ fontSize: 13, maxWidth: 300, textAlign: "center" }}>Please select an active outlet from the header dropdown to start taking POS orders.</div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, height: "calc(100vh - 92px)", overflow: "hidden" }}>
      <style>{`
        .pos-left { display: flex; flex-direction: column; gap: 16; overflow-y: auto; padding-right: 4px; }
        .pos-right { background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; display: flex; flex-direction: column; overflow: hidden; height: 100%; }
        .pos-category-row { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
        .cart-items { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
        .cart-item-row { display: flex; justify-content: space-between; align-items: center; background: var(--bg3); border: 1px solid var(--border); padding: 8px 12px; border-radius: 6px; }
        .qty-ctrl { display: flex; align-items: center; gap: 8px; }
        .qty-btn { width: 22px; height: 22px; border-radius: 4px; border: 1px solid var(--border); background: var(--bg4); color: var(--text); cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: 600; }
        .bill-summary { border-top: 1px solid var(--border); background: var(--bg3); padding: 12px 16px; display: flex; flex-direction: column; gap: 6px; }
        .bill-row { display: flex; justify-content: space-between; font-size: 12.5px; color: var(--text2); }
        .bill-row.total { color: var(--text); font-weight: 700; font-size: 14.5px; border-top: 1px dashed var(--border); padding-top: 6px; margin-top: 4px; }
        
        /* Modal Styles */
        .pos-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 300; }
        .pos-modal { background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; width: 380px; overflow: hidden; }
        .pos-modal-header { padding: 12px 16px; border-bottom: 1px solid var(--border); font-weight: 700; display: flex; justify-content: space-between; }
        .pos-modal-body { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
        .pos-modal-footer { padding: 12px 16px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 8px; }
        .variant-option { display: flex; justify-content: space-between; border: 1px solid var(--border); padding: 8px; border-radius: 6px; cursor: pointer; }
        .variant-option.selected { border-color: var(--accent); background: rgba(59,130,246,0.1); }
      `}</style>

      {/* POS Catalog */}
      <div className="pos-left">
        {/* Header Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <div>
            <div className="page-title">Offline Point of Sale</div>
            <div className="page-sub">Generate and settle tables or walks quickly for {selectedOutlet.name}.</div>
          </div>
          <input 
            type="text" 
            placeholder="Search menu items…" 
            className="btn"
            style={{ background: "var(--bg3)", color: "var(--text)", padding: "7px 12px", width: 220, outline: "none", border: "1px solid var(--border)" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Categories Bar */}
        <div className="pos-category-row">
          {categories.map((c) => (
            <button 
              key={c.id}
              className={`btn${selectedCategory === c.id ? " primary" : ""}`}
              onClick={() => setSelectedCategory(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 16 }}>
          <POSMenuGrid 
            categoryId={selectedCategory} 
            outletId={selectedOutlet.id} 
            search={search} 
            onSelectItem={handleSelectItem} 
          />
        </div>
      </div>

      {/* POS Cart Summary */}
      <div className="pos-right">
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg3)" }}>
          <div style={{ fontWeight: 700, fontSize: 13.5 }}>Current Order Cart</div>
          <div style={{ fontSize: 11, color: "var(--text3)" }}>Walk-in Customer</div>
        </div>

        {/* Cart list */}
        <div className="cart-items">
          {cart.length === 0 ? (
            <div style={{ margin: "auto", color: "var(--text3)", fontSize: 12, textAlign: "center" }}>
              Cart is empty.<br />Click items on the left to add.
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartItemId} className="cart-item-row">
                <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, marginRight: 8 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 500, lineHeight: 1.3 }}>{item.name}</span>
                  <span style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600 }}>₹{item.unitPrice}</span>
                </div>
                <div className="qty-ctrl">
                  <button className="qty-btn" onClick={() => updateQty(item.cartItemId, -1)}>-</button>
                  <span style={{ minWidth: 16, textAlign: "center", fontSize: 12.5, fontWeight: 600 }}>{item.qty}</span>
                  <button className="qty-btn" onClick={() => updateQty(item.cartItemId, 1)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Billing metrics */}
        <div className="bill-summary">
          <div className="bill-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="bill-row">
            <span>Discount (%)</span>
            <input 
              type="number" 
              min="0" 
              max="90" 
              value={discount} 
              onChange={(e) => setDiscount(Math.max(0, parseInt(e.target.value) || 0))}
              style={{ width: 50, background: "var(--bg4)", border: "1px solid var(--border)", borderRadius: 3, padding: "1px 4px", color: "var(--text)", fontSize: 11.5, textAlign: "center" }}
            />
          </div>
          <div className="bill-row">
            <span>GST (5%)</span>
            <span>₹{gst.toFixed(2)}</span>
          </div>
          <div className="bill-row total">
            <span>Amount Due</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          
          <button 
            className="btn primary" 
            style={{ width: "100%", padding: "10px", marginTop: 8, fontSize: 13, fontWeight: 700 }}
            onClick={handleCheckout}
            disabled={checkingOut}
          >
            {checkingOut ? "Settling..." : "Settle & Checkout (Cash/UPI)"}
          </button>
        </div>
      </div>

      {/* Item Customizations Dialog */}
      {customizingItem && (
        <div className="pos-modal-overlay">
          <div className="pos-modal">
            <div className="pos-modal-header">
              <span>Customize {customizingItem.name}</span>
              <button 
                onClick={() => setCustomizingItem(null)}
                style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer" }}
              >✕</button>
            </div>
            <div className="pos-modal-body">
              {/* Variants */}
              {customizingItem.variants && customizingItem.variants.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase" }}>Select Size Variant</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {customizingItem.variants.map((v) => (
                      <div 
                        key={v.id}
                        className={`variant-option${selectedVariant?.id === v.id ? " selected" : ""}`}
                        onClick={() => setSelectedVariant(v)}
                      >
                        <span>{v.name}</span>
                        <span style={{ fontWeight: 600 }}>₹{v.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Addons */}
              {customizingItem.addons && customizingItem.addons.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase" }}>Addons</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {customizingItem.addons.map((a) => {
                      const isChecked = selectedAddons.some((sa) => sa.id === a.id);
                      return (
                        <button 
                          key={a.id}
                          onClick={() => {
                            setSelectedAddons(prev => 
                              isChecked ? prev.filter((sa) => sa.id !== a.id) : [...prev, a]
                            );
                          }}
                          className={`btn${isChecked ? " primary" : ""}`}
                          style={{ fontSize: 11.5, padding: "5px 10px" }}
                        >
                          {a.name} (+₹{a.price})
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="pos-modal-footer">
              <button className="btn" onClick={() => setCustomizingItem(null)}>Cancel</button>
              <button className="btn primary" onClick={handleCustomizationSubmit}>Add To Cart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
