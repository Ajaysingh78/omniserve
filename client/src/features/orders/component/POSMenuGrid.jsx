import { useState, useEffect } from "react";
import axiosInstance from "@/services/axios";

export default function POSMenuGrid({ categoryId, outletId, search, onSelectItem }) {
  const [menuItems, setMenuItems] = useState([]);
  const [inventoryMap, setInventoryMap] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!outletId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch menu items for this outlet
        const itemsRes = await axiosInstance.get(`/menu-items?outletId=${outletId}&limit=100`);
        const fetchedItems = itemsRes.data?.data?.menuItems || [];
        setMenuItems(fetchedItems);

        // Fetch inventory for this outlet
        const invRes = await axiosInstance.get(`/inventory?outletId=${outletId}&limit=100`);
        const fetchedInv = invRes.data?.data?.inventory || [];
        
        // Map menuItemId -> quantity
        const invMap = {};
        fetchedInv.forEach((inv) => {
          const mId = inv.menuItemId?._id || inv.menuItemId?.id || inv.menuItemId;
          if (mId) {
            invMap[mId] = inv.quantity;
          }
        });
        setInventoryMap(invMap);
      } catch (err) {
        console.error("Failed to load catalog menu items or inventory", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [outletId]);

  const filtered = menuItems.filter((item) => {
    if (categoryId !== "All" && item.categoryId !== categoryId) return false;
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

      {loading ? (
        <div style={{ gridColumn: "1/-1", padding: 24, textAlign: "center", color: "var(--text3)" }}>
          Loading menu items…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ gridColumn: "1/-1", padding: 24, textAlign: "center", color: "var(--text3)" }}>
          No menu items found.
        </div>
      ) : (
        filtered.map((item) => {
          const isVeg = item.isVeg;
          const stock = inventoryMap[item.id] !== undefined ? inventoryMap[item.id] : (item.isAvailable ? 99 : 0);
          const isOutOfStock = stock === 0 || !item.isAvailable;

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
                  {stock < 5 && stock > 0 && <span className="tag-other" style={{ color: "var(--amber)", borderColor: "var(--amber)" }}>LOW STOCK</span>}
                </div>
                <div className="pos-item-name">{item.name}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <span className="pos-item-price">₹{item.price}</span>
                <span className="pos-item-stock">
                  {isOutOfStock ? <span className="tag-veg tag-out">OUT</span> : `Stock: ${stock}`}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
