import { configDotenv } from 'dotenv';
configDotenv();

import mongoose from 'mongoose';
import connectToMongoDB from '../config/db.config.js';
import Outlet from '../models/outlet.model.js';
import Category from '../models/category.model.js';
import MenuItem from '../models/menuitems.model.js';
import Inventory from '../models/inventory.model.js';

const seedLatestOutlet = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from environment variables.");
    }
    await connectToMongoDB();

    // 1. Find the latest active outlet
    const outlet = await Outlet.findOne({ isDeleted: false }).sort({ createdAt: -1 });
    if (!outlet) {
      console.log("❌ No outlets found in the database. Please create a restaurant and outlet first!");
      process.exit(0);
    }

    console.log(`📌 Found latest outlet: "${outlet.name}" (ID: ${outlet._id}) for Tenant ID: ${outlet.tenantId}`);

    // 2. Check if this outlet already has categories
    const existingCategories = await Category.find({ outletId: outlet._id });
    if (existingCategories.length > 0) {
      console.log(`⚠️ This outlet already has ${existingCategories.length} categories. Skipping seed to prevent duplicate data.`);
      process.exit(0);
    }

    console.log("🌱 Seeding default categories and menu items...");

    // 3. Define Categories
    const categoriesData = [
      { name: "Burgers", displayOrder: 1 },
      { name: "Pizzas", displayOrder: 2 },
      { name: "Beverages", displayOrder: 3 },
      { name: "Sides", displayOrder: 4 }
    ];

    const categoryMap: { [key: string]: mongoose.Types.ObjectId } = {};

    for (const cat of categoriesData) {
      const newCat = await Category.create({
        outletId: outlet._id,
        tenantId: outlet.tenantId,
        name: cat.name,
        displayOrder: cat.displayOrder,
        isActive: true
      });
      categoryMap[cat.name] = newCat._id as mongoose.Types.ObjectId;
      console.log(`✅ Created Category: "${cat.name}"`);
    }

    // 4. Define Menu Items
    const menuItemsData = [
      // Burgers
      {
        categoryId: categoryMap["Burgers"]!,
        name: "Veggie Supreme Burger",
        description: "Juicy vegetable patty with lettuce, tomatoes, cheese, and special sauce.",
        price: 120,
        isVeg: true,
        sku: "VEG-BRG-01"
      },
      {
        categoryId: categoryMap["Burgers"]!,
        name: "Crispy Chicken Burger",
        description: "Crispy fried chicken breast fillet with mayo and lettuce on a toasted bun.",
        price: 150,
        isVeg: false,
        sku: "CHK-BRG-02"
      },
      // Pizzas
      {
        categoryId: categoryMap["Pizzas"]!,
        name: "Cheese Margherita Pizza",
        description: "Classic hand-tossed pizza with fresh marinara sauce and loaded with mozzarella cheese.",
        price: 240,
        isVeg: true,
        sku: "VEG-PIZ-01"
      },
      {
        categoryId: categoryMap["Pizzas"]!,
        name: "Spicy Chicken Pizza",
        description: "Tender chunks of chicken tikka, onions, and green chilies with spicy tomato sauce.",
        price: 290,
        isVeg: false,
        sku: "CHK-PIZ-02"
      },
      // Beverages
      {
        categoryId: categoryMap["Beverages"]!,
        name: "Iced Cold Coffee",
        description: "Rich, creamy milk blended with premium espresso coffee and served chilled.",
        price: 90,
        isVeg: true,
        sku: "COF-BEV-01"
      },
      {
        categoryId: categoryMap["Beverages"]!,
        name: "Fresh Lime Soda",
        description: "Refreshing carbonated water with freshly squeezed lime juice and a dash of sweet/salt syrup.",
        price: 60,
        isVeg: true,
        sku: "LIM-BEV-02"
      },
      // Sides
      {
        categoryId: categoryMap["Sides"]!,
        name: "French Fries (M)",
        description: "Golden and crispy salted french fries served with sweet tomato ketchup.",
        price: 80,
        isVeg: true,
        sku: "FRY-SDE-01"
      },
      {
        categoryId: categoryMap["Sides"]!,
        name: "Garlic Breadsticks",
        description: "Soft and buttery fresh baked breadsticks seasoned with garlic herbs, served with dip.",
        price: 110,
        isVeg: true,
        sku: "GAR-SDE-02"
      }
    ];

    for (const item of menuItemsData) {
      const newItem = await MenuItem.create({
        categoryId: item.categoryId,
        outletId: outlet._id,
        tenantId: outlet.tenantId,
        name: item.name,
        description: item.description,
        price: item.price,
        isVeg: item.isVeg,
        sku: item.sku,
        isAvailable: true,
        displayOrder: 0
      });

      // 5. Seed Inventory
      await Inventory.create({
        outletId: outlet._id,
        menuItemId: newItem._id,
        tenantId: outlet.tenantId,
        quantity: 50,
        threshold: 10,
        isLowStock: false
      });

      console.log(`✅ Created Menu Item & Inventory (Qty: 50): "${item.name}"`);
    }

    console.log("🎉 Seeding completed successfully! You can now refresh your client app.");
    process.exit(0);
  } catch (err: any) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedLatestOutlet();
