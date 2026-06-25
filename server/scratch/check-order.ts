import dns from 'dns';
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.warn("Unable to set DNS, using defaults:", e);
}

import mongoose, { Types } from 'mongoose';

const MONGO_URI = "mongodb+srv://futurestack07:nitishkumar07@teckstack.lqqhjs0.mongodb.net/FoodMesh-Test";

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected!');

  const Order = mongoose.model('Order', new mongoose.Schema({
    orderNumber: String,
    outletId: mongoose.Schema.Types.ObjectId,
    tenantId: mongoose.Schema.Types.ObjectId,
    orderStatus: String
  }), 'orders');

  const OrderItem = mongoose.model('OrderItem', new mongoose.Schema({
    orderId: mongoose.Schema.Types.ObjectId,
    menuItemId: mongoose.Schema.Types.ObjectId,
    name: String,
    quantity: Number
  }), 'orderitems');

  const Inventory = mongoose.model('Inventory', new mongoose.Schema({
    menuItemId: mongoose.Schema.Types.ObjectId,
    outletId: mongoose.Schema.Types.ObjectId,
    tenantId: mongoose.Schema.Types.ObjectId,
    quantity: Number,
    isDeleted: { type: Boolean, default: false }
  }), 'inventories');

  // Let's find one pending order from the screenshots
  const order = await Order.findOne({ orderStatus: 'PENDING' });
  if (!order) {
    console.log('No pending orders found!');
    await mongoose.disconnect();
    return;
  }

  console.log(`Auditing Order: #${order.orderNumber} (ID: ${order._id.toString()})`);
  console.log(`Outlet ID: ${order.outletId?.toString()}`);
  console.log(`Tenant ID: ${order.tenantId?.toString()}`);

  const items = await OrderItem.find({ orderId: order._id });
  console.log(`Found ${items.length} items in the order:`);

  for (const item of items) {
    console.log(`- Item Name: ${item.name}`);
    console.log(`  Menu Item ID: ${item.menuItemId?.toString()}`);
    console.log(`  Quantity: ${item.quantity}`);

    const inv = await Inventory.findOne({
      menuItemId: item.menuItemId,
      outletId: order.outletId,
      tenantId: order.tenantId,
      isDeleted: false
    });

    if (inv) {
      console.log(`  Inventory Quantity: ${inv.quantity}`);
    } else {
      console.log(`  Inventory Record: NOT FOUND`);
    }
  }

  await mongoose.disconnect();
}

main().catch(console.error);
