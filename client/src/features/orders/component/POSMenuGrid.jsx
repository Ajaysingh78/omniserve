const menuItems = [
  // Appetizers
  { id: "A1", name: "Spring Rolls", price: 180, category: "Appetizers", stock: 12, tags: ["Veg"] },
  { id: "A2", name: "Paneer Tikka", price: 250, category: "Appetizers", stock: 4, tags: ["Veg", "Spicy"] },
  { id: "A3", name: "Veg Manchurian", price: 210, category: "Appetizers", stock: 0, tags: ["Veg"] },
  { id: "A4", name: "French Fries", price: 120, category: "Appetizers", stock: 35, tags: ["Veg"] },

  // Mains
  { id: "M1", name: "Paneer Tikka Masala", price: 280, category: "Mains", stock: 20, tags: ["Veg", "Popular"] },
  { id: "M2", name: "Dal Makhani", price: 240, category: "Mains", stock: 18, tags: ["Veg"] },
  { id: "M3", name: "Chicken Biryani", price: 320, category: "Mains", stock: 6, tags: ["Non-Veg", "Popular"] },
  { id: "M4", name: "Veg Fried Rice", price: 190, category: "Mains", stock: 15, tags: ["Veg"] },

  // Desserts
  { id: "D1", name: "Gulab Jamun", price: 90, category: "Desserts", stock: 40, tags: ["Veg", "Sweet"] },
  { id: "D2", name: "Rasmalai", price: 110, category: "Desserts", stock: 2, tags: ["Veg", "Low Stock"] },
  { id: "D3", name: "Brownie with Ice Cream", price: 160, category: "Desserts", stock: 10, tags: ["Veg"] },

  // Drinks
  { id: "DR1", name: "Masala Chai", price: 40, category: "Drinks", stock: 50, tags: ["Veg"] },
  { id: "DR2", name: "Mango Lassi", price: 90, category: "Drinks", stock: 14, tags: ["Veg"] },
  { id: "DR3", name: "Fresh Lime Soda", price: 70, category: "Drinks", stock: 30, tags: ["Veg"] },
];

export default function POSMenuGrid({ category, search, onSelectItem }) {
  const filtered = menuItems.filter((item) => {
    if (category !== "All" && item.category !== category) return false;
    if (search.trim() !== "") {
      const matches = item.name.toLowerCase().includes(search.toLowerCase());
      if (!matches) return false;
    }
    return true;
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
      <style>{`
        .pos-item-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; justify-content: space-between; gap: 8px; cursor: pointer; transition: all .2s; }
        .pos-item-card:hover { border-color: var(--accent); background: var(--bg3); transform: translateY(-2px); }
        .pos-item-name { font-size: 13.5px; font-weight: 600; color: var(--text); }
        .pos-item-price { font-size: 13px; font-weight: 700; color: var(--accent); }
        .pos-item-stock { font-size: 10px; color: var(--text3); }
        .pos-item-tags { display: flex; gap: 4px; flex-wrap: wrap; }
        .tag-veg { color: #10b981; border: 1px solid #10b98140; background: #10b98115; font-size: 9px; padding: 1px 4px; border-radius: 3px; }
        .tag-non-veg { color: #ef4444; border: 1px solid #ef444440; background: #ef444415; font-size: 9px; padding: 1px 4px; border-radius: 3px; }
        .tag-other { color: var(--text2); border: 1px solid var(--border); font-size: 9px; padding: 1px 4px; border-radius: 3px; }
        .tag-out { color: var(--red); border: 1px solid var(--red); background: rgba(239,68,68,.1); }
      `}</style>

      {filtered.length === 0 ? (
        <div style={{ gridColumn: "1/-1", padding: 24, textAlign: "center", color: "var(--text3)" }}>
          No menu items found.
        </div>
      ) : (
        filtered.map((item) => {
          const isVeg = item.tags.includes("Veg");
          const isOutOfStock = item.stock === 0;

          return (
            <div 
              key={item.id} 
              className="pos-item-card" 
              onClick={() => !isOutOfStock && onSelectItem(item)}
              style={isOutOfStock ? { opacity: 0.5, cursor: "not-allowed" } : {}}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div className="pos-item-tags">
                  <span className={isVeg ? "tag-veg" : "tag-non-veg"}>
                    {isVeg ? "VEG" : "NON-VEG"}
                  </span>
                  {item.stock < 5 && item.stock > 0 && <span className="tag-other" style={{ color: "var(--amber)", borderColor: "var(--amber)" }}>LOW STOCK</span>}
                </div>
                <div className="pos-item-name">{item.name}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <span className="pos-item-price">₹{item.price}</span>
                <span className="pos-item-stock">
                  {isOutOfStock ? <span className="tag-veg tag-out">OUT</span> : `Stock: ${item.stock}`}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
