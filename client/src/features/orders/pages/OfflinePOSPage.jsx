import { useState } from "react";
import POSMenuGrid from "../component/POSMenuGrid";
import toast from "react-hot-toast";

const categories = ["All", "Appetizers", "Mains", "Desserts", "Drinks"];

export default function OfflinePOSPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  
  // Customization modal state
  const [customizingItem, setCustomizingItem] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState("Regular");
  const [selectedAddons, setSelectedAddons] = useState([]);
  
  // Discount percentage
  const [discount, setDiscount] = useState(0);

  // Trigger modal or immediately add to cart
  const handleSelectItem = (item) => {
    // If it's a main dish or sweet, show customization modal for premium look
    if (item.category === "Mains" || item.id === "A2") {
      setCustomizingItem(item);
      setSelectedVariant("Regular");
      setSelectedAddons([]);
    } else {
      addToCart(item, "Regular", []);
    }
  };

  const addToCart = (item, variant, addons) => {
    const cartItemId = `${item.id}-${variant}-${addons.sort().join("-")}`;
    
    // Addon pricing
    const addonsPrice = addons.length * 30; // ₹30 flat per addon
    const itemUnitPrice = item.price + addonsPrice;

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
          name: `${item.name} (${variant}${addons.length ? `, +${addons.join(", ")}` : ""})`,
          basePrice: item.price,
          unitPrice: itemUnitPrice,
          qty: 1,
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

  const toggleAddon = (addon) => {
    setSelectedAddons(prev => 
      prev.includes(addon) ? prev.filter(a => a !== addon) : [...prev, addon]
    );
  };

  // Billing math
  const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const gst = taxableAmount * 0.05; // 5% GST
  const total = taxableAmount + gst;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty!");
      return;
    }
    toast.success(`Bill generated! Total: ₹${total.toFixed(2)}`);
    setCart([]);
    setDiscount(0);
  };

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
            <div className="page-sub">Generate and settle tables or walks quickly.</div>
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
              key={c}
              className={`btn${selectedCategory === c ? " primary" : ""}`}
              onClick={() => setSelectedCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 16 }}>
          <POSMenuGrid category={selectedCategory} search={search} onSelectItem={handleSelectItem} />
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
          >
            Settle & Checkout (Cash/UPI)
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
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase" }}>Select Size Variant</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {["Regular", "Large (+₹50)"].map((v) => (
                    <div 
                      key={v}
                      className={`variant-option${(v.startsWith("Regular") && selectedVariant === "Regular") || (v.startsWith("Large") && selectedVariant === "Large") ? " selected" : ""}`}
                      onClick={() => setSelectedVariant(v.startsWith("Regular") ? "Regular" : "Large")}
                    >
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Addons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase" }}>Addons (₹30 each)</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["Extra Cheese", "Extra Paneer", "Extra Spices", "Butter Dip"].map((a) => {
                    const isChecked = selectedAddons.includes(a);
                    return (
                      <button 
                        key={a}
                        onClick={() => toggleAddon(a)}
                        className={`btn${isChecked ? " primary" : ""}`}
                        style={{ fontSize: 11.5, padding: "5px 10px" }}
                      >
                        {a}
                      </button>
                    );
                  })}
                </div>
              </div>
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
