import { useState, useEffect, useRef, useMemo } from "react";

// ─── MOCK DATA (50+ items) ────────────────────────────────────────────────────

const MENU_ITEMS = [
  // PIZZA
  { id: 1,  name: "Paneer Tikka Pizza",     category: "Pizza",       description: "Spicy paneer with mozzarella & bell peppers",    emoji: "🍕", price: 299, veg: true,  available: true  },
  { id: 2,  name: "Margherita Classic",      category: "Pizza",       description: "Fresh tomato, mozzarella & basil",               emoji: "🍕", price: 249, veg: true,  available: true  },
  { id: 3,  name: "Chicken BBQ Pizza",       category: "Pizza",       description: "Grilled chicken with smoky BBQ sauce",           emoji: "🍕", price: 349, veg: false, available: true  },
  { id: 4,  name: "Double Cheese Burst",     category: "Pizza",       description: "Extra mozzarella stuffed crust pizza",           emoji: "🍕", price: 389, veg: true,  available: true  },
  { id: 5,  name: "Pepperoni Feast",         category: "Pizza",       description: "Classic pepperoni with olives & jalapenos",      emoji: "🍕", price: 369, veg: false, available: false },
  { id: 6,  name: "Farm Fresh Veggie",       category: "Pizza",       description: "Seasonal veggies on herb-infused sauce",         emoji: "🍕", price: 269, veg: true,  available: true  },

  // BURGER
  { id: 7,  name: "Smash Burger Classic",    category: "Burger",      description: "Double smash patty, cheddar & pickles",         emoji: "🍔", price: 199, veg: false, available: true  },
  { id: 8,  name: "Crispy Aloo Tikki",       category: "Burger",      description: "Spiced potato patty with mint chutney",         emoji: "🍔", price: 149, veg: true,  available: true  },
  { id: 9,  name: "Zinger Chicken Burger",   category: "Burger",      description: "Crispy fried chicken with coleslaw",            emoji: "🍔", price: 229, veg: false, available: true  },
  { id: 10, name: "Mushroom Swiss Burger",   category: "Burger",      description: "Sautéed mushrooms with Swiss cheese",           emoji: "🍔", price: 219, veg: true,  available: true  },
  { id: 11, name: "BBQ Bacon Tower",         category: "Burger",      description: "Triple stack with crispy bacon & BBQ",          emoji: "🍔", price: 279, veg: false, available: false },
  { id: 12, name: "Paneer Makhani Burger",   category: "Burger",      description: "Grilled paneer in makhani sauce",               emoji: "🍔", price: 189, veg: true,  available: true  },

  // PASTA
  { id: 13, name: "Penne Arrabbiata",        category: "Pasta",       description: "Spicy tomato & garlic sauce, fresh basil",      emoji: "🍝", price: 229, veg: true,  available: true  },
  { id: 14, name: "Chicken Alfredo",         category: "Pasta",       description: "Creamy white sauce with grilled chicken",       emoji: "🍝", price: 279, veg: false, available: true  },
  { id: 15, name: "Pesto Fusilli",           category: "Pasta",       description: "House-made pesto, pine nuts & parmesan",        emoji: "🍝", price: 249, veg: true,  available: true  },
  { id: 16, name: "Mushroom Carbonara",      category: "Pasta",       description: "Creamy egg sauce with mushrooms & herbs",       emoji: "🍝", price: 259, veg: true,  available: true  },
  { id: 17, name: "Bolognese Spaghetti",     category: "Pasta",       description: "Slow-cooked meat sauce with parmesan",          emoji: "🍝", price: 299, veg: false, available: true  },

  // SANDWICH
  { id: 18, name: "Club Sandwich",           category: "Sandwich",    description: "Triple-decker with chicken, egg & veggies",     emoji: "🥪", price: 179, veg: false, available: true  },
  { id: 19, name: "Grilled Cheese Melt",     category: "Sandwich",    description: "Three-cheese blend on sourdough",               emoji: "🥪", price: 149, veg: true,  available: true  },
  { id: 20, name: "BLT Deluxe",             category: "Sandwich",    description: "Bacon, lettuce, tomato on brioche",             emoji: "🥪", price: 199, veg: false, available: true  },
  { id: 21, name: "Bombay Masala Toast",     category: "Sandwich",    description: "Spiced potato & chutney on toasted bread",      emoji: "🥪", price: 99,  veg: true,  available: true  },
  { id: 22, name: "Chicken Caesar Wrap",     category: "Sandwich",    description: "Grilled chicken, romaine & caesar dressing",    emoji: "🥪", price: 219, veg: false, available: false },

  // INDIAN
  { id: 23, name: "Butter Chicken",          category: "Indian",      description: "Slow-cooked chicken in rich tomato gravy",      emoji: "🍛", price: 329, veg: false, available: true  },
  { id: 24, name: "Dal Makhani",             category: "Indian",      description: "Creamy black lentils slow-cooked overnight",    emoji: "🍛", price: 229, veg: true,  available: true  },
  { id: 25, name: "Paneer Butter Masala",    category: "Indian",      description: "Cottage cheese in buttery tomato gravy",        emoji: "🍛", price: 279, veg: true,  available: true  },
  { id: 26, name: "Chicken Biryani",         category: "Indian",      description: "Fragrant basmati with spiced chicken",          emoji: "🍛", price: 349, veg: false, available: true  },
  { id: 27, name: "Veg Biryani",             category: "Indian",      description: "Aromatic basmati with seasonal vegetables",     emoji: "🍛", price: 249, veg: true,  available: true  },
  { id: 28, name: "Mutton Rogan Josh",        category: "Indian",      description: "Kashmiri-style slow-cooked mutton curry",       emoji: "🍛", price: 399, veg: false, available: true  },

  // CHINESE
  { id: 29, name: "Veg Fried Rice",          category: "Chinese",     description: "Wok-tossed rice with seasonal vegetables",      emoji: "🍜", price: 179, veg: true,  available: true  },
  { id: 30, name: "Chicken Manchurian",      category: "Chinese",     description: "Crispy chicken in tangy Manchurian sauce",      emoji: "🍜", price: 229, veg: false, available: true  },
  { id: 31, name: "Hakka Noodles",           category: "Chinese",     description: "Stir-fried noodles with veggies & soy sauce",   emoji: "🍜", price: 189, veg: true,  available: true  },
  { id: 32, name: "Chilli Paneer Dry",       category: "Chinese",     description: "Crispy paneer tossed in chilli-garlic sauce",   emoji: "🍜", price: 249, veg: true,  available: false },
  { id: 33, name: "Spring Rolls (6pc)",      category: "Chinese",     description: "Crispy rolls stuffed with cabbage & carrots",   emoji: "🍜", price: 149, veg: true,  available: true  },
  { id: 34, name: "Chicken Schezwan Rice",   category: "Chinese",     description: "Spicy Schezwan sauce tossed with chicken rice", emoji: "🍜", price: 219, veg: false, available: true  },

  // SOUTH INDIAN
  { id: 35, name: "Masala Dosa",             category: "South Indian", description: "Crispy dosa with spiced potato filling",        emoji: "🥞", price: 129, veg: true,  available: true  },
  { id: 36, name: "Idli Sambar (4pc)",       category: "South Indian", description: "Steamed idli with sambar & chutneys",           emoji: "🥞", price: 89,  veg: true,  available: true  },
  { id: 37, name: "Medu Vada (2pc)",         category: "South Indian", description: "Crispy lentil donuts with sambar & chutney",    emoji: "🥞", price: 79,  veg: true,  available: true  },
  { id: 38, name: "Uttapam Veggie",          category: "South Indian", description: "Thick rice pancake with onion & tomato",        emoji: "🥞", price: 119, veg: true,  available: true  },
  { id: 39, name: "Pongal Breakfast",        category: "South Indian", description: "Soft rice & lentil porridge with ghee",         emoji: "🥞", price: 109, veg: true,  available: false },

  // BEVERAGES
  { id: 40, name: "Mango Lassi",             category: "Beverages",   description: "Thick yogurt-based mango drink",                emoji: "🥤", price: 89,  veg: true,  available: true  },
  { id: 41, name: "Cold Coffee",             category: "Beverages",   description: "Chilled blended coffee with milk foam",          emoji: "🥤", price: 99,  veg: true,  available: true  },
  { id: 42, name: "Fresh Lime Soda",         category: "Beverages",   description: "Squeezed lime with sparkling water & salt",      emoji: "🥤", price: 69,  veg: true,  available: true  },
  { id: 43, name: "Masala Chai",             category: "Beverages",   description: "Aromatic spiced Indian tea with ginger",         emoji: "🥤", price: 49,  veg: true,  available: true  },
  { id: 44, name: "Watermelon Juice",        category: "Beverages",   description: "Fresh seasonal watermelon blended",             emoji: "🥤", price: 79,  veg: true,  available: true  },
  { id: 45, name: "Classic Coke",            category: "Beverages",   description: "Chilled Coca-Cola 300ml",                       emoji: "🥤", price: 50,  veg: true,  available: true  },

  // DESSERTS
  { id: 46, name: "Gulab Jamun (2pc)",       category: "Desserts",    description: "Soft milk-solid dumplings in rose syrup",       emoji: "🍮", price: 79,  veg: true,  available: true  },
  { id: 47, name: "Chocolate Lava Cake",     category: "Desserts",    description: "Warm cake with molten chocolate center",         emoji: "🍮", price: 149, veg: true,  available: true  },
  { id: 48, name: "Rasmalai (2pc)",          category: "Desserts",    description: "Spongy paneer in saffron-flavored milk",         emoji: "🍮", price: 99,  veg: true,  available: false },
  { id: 49, name: "Kulfi Falooda",           category: "Desserts",    description: "Indian ice cream with vermicelli & rose syrup",  emoji: "🍮", price: 119, veg: true,  available: true  },
  { id: 50, name: "Tiramisu",               category: "Desserts",    description: "Classic Italian coffee & mascarpone dessert",    emoji: "🍮", price: 169, veg: true,  available: true  },

  // COMBOS
  { id: 51, name: "Pizza + Coke Combo",      category: "Combos",      description: "Any medium pizza with a chilled Coke",           emoji: "🎁", price: 399, veg: true,  available: true  },
  { id: 52, name: "Burger Meal Deal",        category: "Combos",      description: "Burger + fries + beverage of choice",           emoji: "🎁", price: 299, veg: false, available: true  },
  { id: 53, name: "Family Feast Box",        category: "Combos",      description: "2 Pizzas + Garlic bread + 2 Cokes",             emoji: "🎁", price: 799, veg: true,  available: true  },
  { id: 54, name: "Thali Combo",            category: "Combos",      description: "Dal + Sabzi + Roti + Rice + Dessert",           emoji: "🎁", price: 249, veg: true,  available: true  },
  { id: 55, name: "Office Lunch Pack",       category: "Combos",      description: "Biryani + Raita + Soft drink + Sweet",          emoji: "🎁", price: 349, veg: false, available: true  },
];

const CATEGORIES = ["All", "Pizza", "Burger", "Pasta", "Sandwich", "Indian", "Chinese", "South Indian", "Beverages", "Desserts", "Combos"];

const GST_RATE = 0.18;
const DISCOUNT_AMOUNT = 50;

// ─── INLINE STYLES (same dark theme as FoodMesh Dashboard) ───────────────────

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #0a0b0d;
    --bg2:     #111318;
    --bg3:     #16191f;
    --bg4:     #1d2026;
    --border:  #2a2d35;
    --border2: #363a45;
    --text:    #e8eaf0;
    --text2:   #9aa0b0;
    --text3:   #5c6270;
    --accent:  #3b82f6;
    --accent2: #1d4ed8;
    --green:   #10b981;
    --red:     #ef4444;
    --amber:   #f59e0b;
    --purple:  #8b5cf6;
    --teal:    #06b6d4;
    --radius:  10px;
    --radius2: 6px;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  }

  html, body, #root { height: 100%; background: var(--bg); color: var(--text); font-size: 13px; }

  /* scrollbar */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

  /* ── LAYOUT ── */
  .pos-root { display: flex; height: 100vh; overflow: hidden; background: var(--bg); }
  .pos-left  { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: hidden; border-right: 1px solid var(--border); }
  .pos-right { width: 360px; min-width: 360px; display: flex; flex-direction: column; overflow: hidden; background: var(--bg2); }

  /* ── TOPBAR ── */
  .pos-topbar { padding: 14px 20px; border-bottom: 1px solid var(--border); background: var(--bg2); display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  .pos-logo   { display: flex; align-items: center; gap: 8px; margin-right: 4px; }
  .logo-mark  { width: 30px; height: 30px; background: linear-gradient(135deg,#3b82f6,#8b5cf6); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px; color: #fff; flex-shrink: 0; }
  .logo-text  { font-weight: 700; font-size: 14px; letter-spacing: -.3px; white-space: nowrap; }
  .logo-sub   { font-size: 9px; color: var(--text3); }
  .divider-v  { width: 1px; height: 28px; background: var(--border); flex-shrink: 0; }
  .search-box { display: flex; align-items: center; gap: 8px; background: var(--bg3); border: 1px solid var(--border); border-radius: var(--radius2); padding: 7px 12px; flex: 1; max-width: 320px; }
  .search-box input { background: none; border: none; outline: none; color: var(--text); font-size: 13px; width: 100%; }
  .search-box input::placeholder { color: var(--text3); }
  .selector { display: flex; align-items: center; gap: 6px; background: var(--bg3); border: 1px solid var(--border); border-radius: var(--radius2); padding: 7px 11px; cursor: pointer; font-size: 12px; color: var(--text2); white-space: nowrap; }
  .selector:hover { border-color: var(--border2); color: var(--text); }
  .order-type-btns { display: flex; gap: 2px; background: var(--bg3); border: 1px solid var(--border); border-radius: var(--radius2); padding: 3px; margin-left: auto; }
  .ot-btn { padding: 5px 12px; border-radius: 4px; font-size: 11.5px; font-weight: 500; cursor: pointer; color: var(--text2); border: none; background: transparent; transition: all .15s; }
  .ot-btn.active { background: var(--accent); color: #fff; }
  .ot-btn:hover:not(.active) { background: var(--bg4); color: var(--text); }

  /* ── CATEGORY BAR ── */
  .cat-bar { display: flex; gap: 6px; padding: 12px 20px; border-bottom: 1px solid var(--border); background: var(--bg2); overflow-x: auto; flex-shrink: 0; scrollbar-width: none; }
  .cat-bar::-webkit-scrollbar { display: none; }
  .cat-btn { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 500; cursor: pointer; white-space: nowrap; border: 1px solid var(--border); background: transparent; color: var(--text2); transition: all .15s; flex-shrink: 0; }
  .cat-btn:hover { border-color: var(--border2); color: var(--text); }
  .cat-btn.active { background: var(--accent); border-color: var(--accent); color: #fff; }
  .cat-badge { font-size: 10px; background: rgba(255,255,255,.15); border-radius: 20px; padding: 0 5px; }
  .cat-btn:not(.active) .cat-badge { background: var(--bg4); color: var(--text3); }

  /* ── MENU GRID ── */
  .menu-scroll { flex: 1; overflow-y: auto; padding: 16px 20px; }
  .menu-grid   { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  @media (max-width: 1200px) { .menu-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 800px)  { .menu-grid { grid-template-columns: repeat(2, 1fr); } }

  /* ── MENU CARD ── */
  .menu-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; transition: all .2s; cursor: pointer; display: flex; flex-direction: column; }
  .menu-card:hover { border-color: var(--border2); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.4); }
  .menu-card.unavailable { opacity: .5; pointer-events: none; }
  .card-img { height: 100px; display: flex; align-items: center; justify-content: center; font-size: 44px; background: var(--bg3); position: relative; }
  .card-body { padding: 10px 12px; flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .card-name { font-size: 12.5px; font-weight: 600; line-height: 1.3; }
  .card-desc { font-size: 11px; color: var(--text3); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 6px; }
  .card-price { font-size: 14px; font-weight: 700; }
  .veg-badge { display: flex; align-items: center; gap: 3px; font-size: 9.5px; font-weight: 600; padding: 1px 6px; border-radius: 4px; border: 1px solid; }
  .veg-badge.veg { border-color: var(--green); color: var(--green); }
  .veg-badge.nonveg { border-color: var(--red); color: var(--red); }
  .unavail-tag { font-size: 10px; color: var(--text3); font-style: italic; }

  /* add button */
  .add-btn { display: flex; align-items: center; justify-content: center; gap: 4px; padding: 5px 14px; border-radius: var(--radius2); font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid var(--accent); background: transparent; color: var(--accent); transition: all .15s; margin: 0 12px 12px; }
  .add-btn:hover { background: var(--accent); color: #fff; }
  .qty-ctrl { display: flex; align-items: center; gap: 0; margin: 0 12px 12px; background: var(--bg3); border: 1px solid var(--border); border-radius: var(--radius2); overflow: hidden; }
  .qty-ctrl button { width: 32px; height: 30px; border: none; background: transparent; color: var(--text2); cursor: pointer; font-size: 15px; font-weight: 600; transition: all .15s; }
  .qty-ctrl button:hover { background: var(--bg4); color: var(--text); }
  .qty-num { flex: 1; text-align: center; font-size: 13px; font-weight: 700; color: var(--text); }

  /* fav */
  .fav-btn { position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,.4); border: none; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 13px; transition: transform .2s; }
  .fav-btn:hover { transform: scale(1.2); }

  /* ── EMPTY STATE ── */
  .empty-menu { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 12px; color: var(--text3); }
  .empty-icon { font-size: 48px; opacity: .5; }

  /* ── CART PANEL ── */
  .cart-header { padding: 14px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
  .cart-title  { font-size: 13.5px; font-weight: 700; }
  .cart-count  { background: var(--accent); color: #fff; font-size: 10px; font-weight: 700; padding: 1px 7px; border-radius: 20px; }
  .cart-items  { flex: 1; overflow-y: auto; padding: 8px 0; }

  /* ── CART ITEM ── */
  .cart-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 16px; border-bottom: 1px solid var(--border); transition: background .15s; }
  .cart-item:hover { background: var(--bg3); }
  .ci-info { flex: 1; min-width: 0; }
  .ci-name { font-size: 12.5px; font-weight: 600; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ci-price { font-size: 11px; color: var(--text2); }
  .ci-ctrl { display: flex; align-items: center; gap: 4px; }
  .ci-btn { width: 24px; height: 24px; border-radius: 4px; border: 1px solid var(--border); background: var(--bg3); color: var(--text2); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px; transition: all .15s; }
  .ci-btn:hover { background: var(--bg4); color: var(--text); }
  .ci-qty { font-size: 13px; font-weight: 700; min-width: 22px; text-align: center; }
  .ci-total { font-size: 13px; font-weight: 700; min-width: 52px; text-align: right; }
  .ci-del { background: none; border: none; color: var(--text3); cursor: pointer; font-size: 13px; padding: 2px; border-radius: 4px; transition: all .15s; }
  .ci-del:hover { color: var(--red); background: rgba(239,68,68,.1); }

  /* ── EMPTY CART ── */
  .empty-cart { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 10px; color: var(--text3); padding: 20px; text-align: center; }
  .empty-cart-icon { font-size: 40px; opacity: .4; }

  /* ── ORDER SUMMARY ── */
  .order-summary { padding: 12px 16px; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); flex-shrink: 0; }
  .sum-row { display: flex; justify-content: space-between; align-items: center; font-size: 12.5px; color: var(--text2); margin-bottom: 6px; }
  .sum-row.total { font-size: 15px; font-weight: 700; color: var(--text); margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border); margin-bottom: 0; }
  .sum-row .discount { color: var(--green); }

  /* ── CUSTOMER / NOTES ── */
  .cart-form { padding: 12px 16px; border-bottom: 1px solid var(--border); flex-shrink: 0; display: flex; flex-direction: column; gap: 8px; }
  .form-row  { display: flex; gap: 8px; }
  .fm-input  { flex: 1; background: var(--bg3); border: 1px solid var(--border); border-radius: var(--radius2); padding: 7px 10px; font-size: 12px; color: var(--text); outline: none; }
  .fm-input::placeholder { color: var(--text3); }
  .fm-input:focus { border-color: var(--accent); }
  .fm-label { font-size: 10.5px; color: var(--text3); font-weight: 500; text-transform: uppercase; letter-spacing: .4px; margin-bottom: 4px; }
  textarea.fm-input { resize: none; height: 56px; font-family: inherit; }

  /* ── ACTION BUTTONS ── */
  .cart-actions { padding: 12px 16px; display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; }
  .btn-secondary { padding: 10px; border-radius: var(--radius2); font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid var(--border); background: var(--bg3); color: var(--text2); transition: all .15s; text-align: center; }
  .btn-secondary:hover { background: var(--bg4); color: var(--text); }
  .btn-primary { padding: 11px; border-radius: var(--radius2); font-size: 13px; font-weight: 700; cursor: pointer; border: none; background: var(--accent); color: #fff; transition: all .15s; text-align: center; }
  .btn-primary:hover { background: var(--accent2); }
  .btn-primary:disabled { opacity: .4; cursor: not-allowed; }

  /* ── MODAL ── */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn .15s; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal { background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; width: 100%; max-width: 440px; overflow: hidden; animation: slideUp .2s; }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .modal-header { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .modal-title  { font-size: 15px; font-weight: 700; }
  .modal-body   { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
  .modal-footer { padding: 14px 20px; border-top: 1px solid var(--border); display: flex; gap: 10px; }
  .modal-footer .btn-secondary { flex: 1; }
  .modal-footer .btn-primary   { flex: 2; }

  /* payment methods */
  .pay-methods { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .pay-btn { padding: 14px 10px; border-radius: var(--radius); border: 1px solid var(--border); background: var(--bg3); color: var(--text2); cursor: pointer; text-align: center; transition: all .15s; font-size: 12px; font-weight: 600; display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .pay-btn:hover { border-color: var(--border2); }
  .pay-btn.active { border-color: var(--accent); background: rgba(59,130,246,.1); color: var(--accent); }
  .pay-icon { font-size: 22px; }

  /* amount fields */
  .amount-grid { display: flex; flex-direction: column; gap: 8px; }
  .amount-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--bg3); border-radius: var(--radius2); }
  .amount-row.total { border: 1px solid var(--accent); }
  .amount-label { font-size: 12px; color: var(--text2); }
  .amount-val   { font-size: 14px; font-weight: 700; }
  .amount-val.green  { color: var(--green); }
  .amount-val.accent { color: var(--accent); }
  .received-input { background: var(--bg3); border: 1px solid var(--border); border-radius: var(--radius2); padding: 9px 12px; font-size: 15px; font-weight: 700; color: var(--text); outline: none; width: 100%; }
  .received-input:focus { border-color: var(--accent); }

  /* success */
  .payment-success { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 20px; text-align: center; }
  .success-icon { font-size: 48px; animation: pop .4s; }
  @keyframes pop { 0%{transform:scale(.5)} 80%{transform:scale(1.1)} 100%{transform:scale(1)} }

  /* skeleton */
  .skeleton { background: linear-gradient(90deg, var(--bg3) 25%, var(--bg4) 50%, var(--bg3) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: var(--radius2); }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  .skel-card { height: 180px; border-radius: var(--radius); }
`;

// ─── ICONS (inline SVG) ───────────────────────────────────────────────────────

const Icon = ({ d, size = 14, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
       strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
    <path d={d} />
  </svg>
);
const ISearch  = ({size=14}) => <Icon size={size} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />;
const IPlus    = () => <Icon d="M12 5v14M5 12h14" />;
const IMinus   = () => <Icon d="M5 12h14" />;
const ITrash   = () => <Icon d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />;
const IClose   = () => <Icon d="M18 6L6 18M6 6l12 12" />;
const IChevD   = () => <Icon size={10} d="M6 9l6 6 6-6" />;
const ICheck   = () => <Icon size={20} d="M20 6L9 17l-5-5" color="#10b981" />;

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function OrderPage() {
  // ── State ──
  const [search, setSearch]           = useState("");
  const [activeCategory, setCategory] = useState("All");
  const [orderType, setOrderType]     = useState("Dine In");
  const [cart, setCart]               = useState([]);          // [{item, qty}]
  const [favorites, setFavorites]     = useState(new Set());
  const [customer, setCustomer]       = useState({ name: "", phone: "" });
  const [notes, setNotes]             = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [payMethod, setPayMethod]     = useState("Cash");
  const [received, setReceived]       = useState("");
  const [paid, setPaid]               = useState(false);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  // ── Cart helpers ──
  const addToCart = (item) => {
    setCart(c => {
      const ex = c.find(x => x.item.id === item.id);
      if (ex) return c.map(x => x.item.id === item.id ? { ...x, qty: x.qty + 1 } : x);
      return [...c, { item, qty: 1 }];
    });
  };
  const removeFromCart = (id) => setCart(c => c.filter(x => x.item.id !== id));
  const incQty = (id) => setCart(c => c.map(x => x.item.id === id ? { ...x, qty: x.qty + 1 } : x));
  const decQty = (id) => setCart(c => {
    const ex = c.find(x => x.item.id === id);
    if (ex.qty === 1) return c.filter(x => x.item.id !== id);
    return c.map(x => x.item.id === id ? { ...x, qty: x.qty - 1 } : x);
  });
  const cartQty = (id) => cart.find(x => x.item.id === id)?.qty || 0;
  const clearCart = () => { setCart([]); setNotes(""); setCustomer({ name: "", phone: "" }); };

  // ── Totals ──
  const subtotal = cart.reduce((a, x) => a + x.item.price * x.qty, 0);
  const gst      = Math.round(subtotal * GST_RATE);
  const discount = cart.length > 0 ? DISCOUNT_AMOUNT : 0;
  const total    = subtotal + gst - discount;
  const change   = Math.max(0, Number(received) - total);
  const balance  = Math.max(0, total - Number(received));

  // ── Filtered items ──
  const filtered = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      const matchCat  = activeCategory === "All" || item.category === activeCategory;
      const matchSrch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                        item.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSrch;
    });
  }, [activeCategory, search]);

  // ── Category counts ──
  const catCount = (cat) => cat === "All" ? MENU_ITEMS.length :
    MENU_ITEMS.filter(i => i.category === cat).length;

  // ── Payment confirm ──
  const confirmPayment = () => { setPaid(true); };
  const closePayment   = () => {
    if (paid) { clearCart(); setPaid(false); }
    setShowPayment(false);
    setReceived("");
    setPayMethod("Cash");
  };

  const totalItems = cart.reduce((a, x) => a + x.qty, 0);

  return (
    <>
      <style>{CSS}</style>

      <div className="pos-root">
        {/* ════════════════════════════════════════════
            LEFT SECTION
        ════════════════════════════════════════════ */}
        <div className="pos-left">
          {/* Top Bar */}
          <div className="pos-topbar">
            <div className="pos-logo">
              <div className="logo-mark">FM</div>
              <div>
                <div className="logo-text">FoodMesh</div>
                <div className="logo-sub">POS · Offline Orders</div>
              </div>
            </div>
            <div className="divider-v" />

            <div className="search-box">
              <ISearch size={13} />
              <input
                placeholder="Search menu items…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <span style={{ cursor: "pointer", color: "var(--text3)", lineHeight: 1 }}
                      onClick={() => setSearch("")}>✕</span>
              )}
            </div>

            <div className="selector">
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block", flexShrink: 0 }} />
              Spice Garden – MG Road
              <IChevD />
            </div>

            <div className="order-type-btns">
              {["Dine In", "Takeaway", "Delivery"].map(t => (
                <button key={t} className={`ot-btn${orderType === t ? " active" : ""}`}
                        onClick={() => setOrderType(t)}>{t}</button>
              ))}
            </div>
          </div>

          {/* Category Bar */}
          <div className="cat-bar">
            {loading
              ? Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ width: 80 + i * 10, height: 32, borderRadius: 20, flexShrink: 0 }} />
                ))
              : CATEGORIES.map(cat => (
                  <button key={cat}
                    className={`cat-btn${activeCategory === cat ? " active" : ""}`}
                    onClick={() => setCategory(cat)}>
                    {cat}
                    <span className="cat-badge">{catCount(cat)}</span>
                  </button>
                ))
            }
          </div>

          {/* Menu Grid */}
          <div className="menu-scroll">
            {loading ? (
              <div className="menu-grid">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="skeleton skel-card" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-menu">
                <div className="empty-icon">🍽️</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text2)" }}>No items found</div>
                <div style={{ fontSize: 12 }}>Try a different search or category</div>
                <button className="btn-secondary" style={{ marginTop: 8, padding: "8px 20px", borderRadius: "var(--radius2)" }}
                        onClick={() => { setSearch(""); setCategory("All"); }}>Clear filters</button>
              </div>
            ) : (
              <div className="menu-grid">
                {filtered.map(item => {
                  const qty = cartQty(item.id);
                  const isFav = favorites.has(item.id);
                  return (
                    <div key={item.id} className={`menu-card${!item.available ? " unavailable" : ""}`}>
                      <div className="card-img">
                        <span>{item.emoji}</span>
                        <button className="fav-btn"
                                onClick={(e) => { e.stopPropagation(); setFavorites(f => { const n = new Set(f); n.has(item.id) ? n.delete(item.id) : n.add(item.id); return n; }); }}>
                          {isFav ? "❤️" : "🤍"}
                        </button>
                        {!item.available && (
                          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 11, color: "#fff", background: "rgba(0,0,0,.6)", padding: "3px 8px", borderRadius: 4 }}>Unavailable</span>
                          </div>
                        )}
                      </div>

                      <div className="card-body">
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 4 }}>
                          <div className="card-name">{item.name}</div>
                          <div className={`veg-badge ${item.veg ? "veg" : "nonveg"}`} style={{ flexShrink: 0, marginTop: 1 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: item.veg ? "var(--green)" : "var(--red)", display: "inline-block" }} />
                            {item.veg ? "Veg" : "Non-V"}
                          </div>
                        </div>
                        <div className="card-desc">{item.description}</div>
                        <div className="card-footer">
                          <div className="card-price">₹{item.price}</div>
                          {!item.available && <span className="unavail-tag">Out of stock</span>}
                        </div>
                      </div>

                      {item.available && (
                        qty === 0 ? (
                          <button className="add-btn" onClick={() => addToCart(item)}>
                            <IPlus /> Add
                          </button>
                        ) : (
                          <div className="qty-ctrl">
                            <button onClick={() => decQty(item.id)}>−</button>
                            <span className="qty-num">{qty}</span>
                            <button onClick={() => incQty(item.id)}>+</button>
                          </div>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════
            RIGHT SECTION – CART
        ════════════════════════════════════════════ */}
        <div className="pos-right">
          {/* Header */}
          <div className="cart-header">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="cart-title">Current Order</span>
              {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
            </div>
            {cart.length > 0 && (
              <button onClick={clearCart} style={{ fontSize: 11, color: "var(--text3)", background: "none", border: "none", cursor: "pointer" }}>
                Clear all
              </button>
            )}
          </div>

          {/* Cart Items */}
          <div className="cart-items">
            {loading ? (
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                {[80, 60, 90].map((w, i) => (
                  <div key={i} className="skeleton" style={{ height: 50, borderRadius: 6 }} />
                ))}
              </div>
            ) : cart.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text2)" }}>No items added yet</div>
                <div style={{ fontSize: 12 }}>Browse the menu and add items to get started</div>
                <button className="btn-secondary" style={{ marginTop: 8, padding: "8px 20px", borderRadius: "var(--radius2)" }}>
                  Browse Menu
                </button>
              </div>
            ) : (
              cart.map(({ item, qty }) => (
                <div key={item.id} className="cart-item">
                  <div className="ci-info">
                    <div className="ci-name">{item.name}</div>
                    <div className="ci-price">₹{item.price} × {qty}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div className="ci-ctrl">
                      <button className="ci-btn" onClick={() => decQty(item.id)}>−</button>
                      <span className="ci-qty">{qty}</span>
                      <button className="ci-btn" onClick={() => incQty(item.id)}>+</button>
                    </div>
                    <span className="ci-total">₹{item.price * qty}</span>
                    <button className="ci-del" onClick={() => removeFromCart(item.id)} title="Remove"><ITrash /></button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary */}
          {cart.length > 0 && (
            <div className="order-summary">
              <div className="sum-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="sum-row"><span>GST (18%)</span><span>₹{gst}</span></div>
              <div className="sum-row"><span>Discount</span><span className="discount">−₹{discount}</span></div>
              <div className="sum-row total"><span>Grand Total</span><span>₹{total}</span></div>
            </div>
          )}

          {/* Customer Info + Notes */}
          <div className="cart-form">
            <div className="fm-label">Customer (optional)</div>
            <div className="form-row">
              <input className="fm-input" placeholder="Name" value={customer.name}
                     onChange={e => setCustomer(c => ({ ...c, name: e.target.value }))} />
              <input className="fm-input" placeholder="Phone" value={customer.phone}
                     onChange={e => setCustomer(c => ({ ...c, phone: e.target.value }))} />
            </div>
            <div className="fm-label" style={{ marginTop: 4 }}>Order Notes</div>
            <textarea className="fm-input" placeholder="e.g. No onions, Extra spicy…"
                      value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          {/* Actions */}
          <div className="cart-actions">
            <button className="btn-secondary">💾 Save Draft</button>
            <button className="btn-primary" disabled={cart.length === 0}
                    onClick={() => setShowPayment(true)}>
              Proceed to Payment →
            </button>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          PAYMENT MODAL
      ════════════════════════════════════════════ */}
      {showPayment && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closePayment()}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{paid ? "Payment Successful" : "Proceed to Payment"}</div>
              <button className="ci-del" onClick={closePayment}><IClose /></button>
            </div>

            {paid ? (
              <div className="payment-success">
                <div className="success-icon">✅</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>Order Confirmed!</div>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>
                  {customer.name ? `Thank you, ${customer.name}!` : "Thank you for your order!"}
                </div>
                <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 4 }}>
                  Paid via <strong>{payMethod}</strong> · ₹{total}
                </div>
                {Number(received) > total && (
                  <div style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>
                    Change: ₹{change}
                  </div>
                )}
                <button className="btn-primary" style={{ width: "100%", marginTop: 8 }} onClick={closePayment}>
                  New Order
                </button>
              </div>
            ) : (
              <>
                <div className="modal-body">
                  {/* Payment Methods */}
                  <div>
                    <div className="fm-label" style={{ marginBottom: 8 }}>Payment Method</div>
                    <div className="pay-methods">
                      {[
                        { id: "Cash",   icon: "💵" },
                        { id: "UPI",    icon: "📱" },
                        { id: "Card",   icon: "💳" },
                        { id: "Wallet", icon: "👜" },
                      ].map(({ id, icon }) => (
                        <button key={id} className={`pay-btn${payMethod === id ? " active" : ""}`}
                                onClick={() => setPayMethod(id)}>
                          <span className="pay-icon">{icon}</span>
                          {id}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount Summary */}
                  <div className="amount-grid">
                    <div className="amount-row total">
                      <span className="amount-label">Total Amount</span>
                      <span className="amount-val accent">₹{total}</span>
                    </div>

                    {payMethod === "Cash" && (
                      <>
                        <div>
                          <div className="fm-label" style={{ marginBottom: 6 }}>Received Amount (₹)</div>
                          <input
                            className="received-input"
                            type="number"
                            placeholder={`Enter amount (min ₹${total})`}
                            value={received}
                            onChange={e => setReceived(e.target.value)}
                          />
                        </div>
                        {Number(received) > 0 && (
                          <>
                            <div className="amount-row">
                              <span className="amount-label">Balance Due</span>
                              <span className="amount-val" style={{ color: balance > 0 ? "var(--red)" : "var(--green)" }}>
                                ₹{balance}
                              </span>
                            </div>
                            {change > 0 && (
                              <div className="amount-row">
                                <span className="amount-label">Change Return</span>
                                <span className="amount-val green">₹{change}</span>
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}

                    {payMethod !== "Cash" && (
                      <div className="amount-row">
                        <span className="amount-label">Amount to Collect</span>
                        <span className="amount-val green">₹{total}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="btn-secondary" onClick={closePayment}>Cancel</button>
                  <button
                    className="btn-primary"
                    disabled={payMethod === "Cash" && (Number(received) < total || !received)}
                    onClick={confirmPayment}
                  >
                    Confirm Payment ✓
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}