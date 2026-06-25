import dns from 'dns';
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.warn("Unable to set DNS, using defaults:", e);
}

import mongoose, { Types } from 'mongoose';
import { OrderService } from '../src/services/order.service.js';
import { OrderStatus } from '../src/enums/enums.js';
import Order from '../src/models/order.model.js';
import User from '../src/models/user.model.js';

const MONGO_URI = "mongodb+srv://futurestack07:nitishkumar07@teckstack.lqqhjs0.mongodb.net/FoodMesh-Test";

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected!');

  // Find the order containing 'MTU' in orderNumber
  const order = await Order.findOne({ orderNumber: { $regex: 'MTU', $options: 'i' } });
  if (!order) {
    console.error("Order MTU-Q00A not found!");
    await mongoose.disconnect();
    return;
  }

  console.log(`Auditing Order: #${order.orderNumber} (ID: ${order._id.toString()})`);
  console.log(`Outlet ID: ${order.outletId?.toString()}`);
  console.log(`Tenant ID: ${order.tenantId?.toString()}`);

  const OrderItem = mongoose.model('OrderItem');
  const Inventory = mongoose.model('Inventory');

  const items = await OrderItem.find({ orderId: order._id });
  console.log(`Found ${items.length} items in the order:`);

  for (const item of items) {
    console.log(`- Item Name: ${item.name}`);
    console.log(`  Menu Item ID: ${item.menuItemId?.toString()}`);
    console.log(`  Quantity: ${item.quantity}`);

    let inv = await Inventory.findOne({
      menuItemId: item.menuItemId,
      outletId: order.outletId,
      tenantId: order.tenantId,
      isDeleted: false
    });

    if (!inv) {
      console.log(`  Inventory Record not found. Creating one with 100 units...`);
      inv = await Inventory.create({
        menuItemId: item.menuItemId,
        outletId: order.outletId,
        tenantId: order.tenantId,
        quantity: 100,
        threshold: 10,
        isLowStock: false,
        isSandbox: true,
        sandboxVersion: 'v1'
      });
    }
    console.log(`  Inventory Quantity: ${inv.quantity}`);
  }

  const user = await User.findOne({ email: 'ersamirsingh@gmail.com' });
  if (!user) {
    console.error("Outlet Manager Nitish Kumar not found!");
    await mongoose.disconnect();
    return;
  }

  console.log(`Attempting to accept order ${order.orderNumber} using Outlet Manager: ${user.email} (${user._id.toString()})...`);
  try {
    const updated = await OrderService.updateOrderStatus(
      order._id.toString(),
      order.tenantId.toString(),
      OrderStatus.ACCEPTED,
      user._id.toString()
    );
    console.log("SUCCESS! Order status updated to:", updated?.orderStatus);
  } catch (err: any) {
    console.error("FAILURE: Status update failed with error:");
    console.error(err.message);
  }

  await mongoose.disconnect();
}

main().catch(console.error);
