import dns from "dns";
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.warn("Unable to set custom DNS servers, using system defaults:", e);
}

import mongoose from "mongoose";
import dotenv from "dotenv";
import ExternalOrder from "../src/models/externalorder.model.js";

dotenv.config();

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/FoodMesh-Test";

async function checkRecentOrders() {
  await mongoose.connect(uri);
  const tenantId = new mongoose.Types.ObjectId("6a37bcb95603e7018ba3f6cd");
  
  // Find external orders in the last 30 minutes
  const halfHourAgo = new Date(Date.now() - 30 * 60 * 1000);
  const orders = await ExternalOrder.find({
    tenantId,
    createdAt: { $gte: halfHourAgo }
  }).sort({ createdAt: -1 });

  console.log(`\nFound ${orders.length} external orders in the last 30 minutes:`);
  orders.forEach(o => {
    console.log(`- ID: ${o._id}, ExtOrderID: ${o.externalOrderId}, Provider: ${o.provider}, Status: ${o.status}, Reason: ${o.failureReason}, CreatedAt: ${o.createdAt.toISOString()}`);
  });

  await mongoose.disconnect();
}

checkRecentOrders().catch(console.error);
