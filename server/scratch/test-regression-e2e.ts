import dns from "dns";
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.warn("Unable to set custom DNS servers, using system defaults:", e);
}

import mongoose from "mongoose";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Mock transaction support for standalone MongoDB instances
const originalStartSession = mongoose.startSession;
(mongoose as any).startSession = async function(options?: any) {
  const session = await originalStartSession.call(mongoose, options);
  session.startTransaction = () => {};
  session.commitTransaction = async () => {};
  session.abortTransaction = async () => {};
  session.inTransaction = () => false;
  return session;
};

import app from "../src/app.js";
import Tenant from "../src/models/tenant.model.js";
import User from "../src/models/user.model.js";
import Restaurant from "../src/models/restaurant.model.js";
import Outlet from "../src/models/outlet.model.js";
import Category from "../src/models/category.model.js";
import MenuItem from "../src/models/menuitems.model.js";
import Variant from "../src/models/variant.model.js";
import Addon from "../src/models/addon.model.js";
import Inventory from "../src/models/inventory.model.js";
import ChannelConnection from "../src/models/channelconnection.model.js";
import ChannelOutletMapping from "../src/models/channeloutletmapping.model.js";
import ChannelMenuItemMapping from "../src/models/channelmenuitemmapping.model.js";
import ChannelVariantMapping from "../src/models/channelvariantmapping.model.js";
import ChannelAddonMapping from "../src/models/channeladdonmapping.model.js";
import ExternalOrder from "../src/models/externalorder.model.js";
import Order from "../src/models/order.model.js";
import OrderItem from "../src/models/orderitems.model.js";
import OrderTimeline from "../src/models/ordertimeline.model.js";
import IntegrationEventQueue from "../src/models/integration-event-queue.model.js";
import SyncJob from "../src/models/syncjob.model.js";
import ProviderSyncState from "../src/models/providersyncstate.model.js";
import Notification from "../src/models/notification.model.js";
import Customer from "../src/models/customer.model.js";
import Cart from "../src/models/cart.model.js";
import Table from "../src/models/table.model.js";
import DiningArea from "../src/models/diningarea.model.js";

import { OrderService } from "../src/services/order.service.js";
import { OutboxPollerService } from "../src/services/outbox-poller.service.js";
import { initWorkerRegistry } from "../src/workers/register-workers.js";
import { OrderStatus } from "../src/enums/enums.js";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test_jwt_secret_key";

const MONGO_URIS = [
  "mongodb+srv://futurestack07:nitishkumar07@teckstack.lqqhjs0.mongodb.net/FoodMesh-Test",
  "mongodb://127.0.0.1:27017/FoodMesh-Test"
];

async function runRegressionTests() {
  initWorkerRegistry();
  console.log("Connecting to MongoDB...");
  let connected = false;
  for (const uri of MONGO_URIS) {
    try {
      console.log(`Connecting to: ${uri}`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
      console.log(`Connected successfully to ${uri}`);
      connected = true;
      break;
    } catch (e: any) {
      console.warn(`Connection failed for ${uri}: ${e.message}`);
    }
  }

  if (!connected) {
    throw new Error("Unable to connect to MongoDB.");
  }

  const tenantName = "E2E Regression Test Tenant";
  console.log("Cleaning up old test data...");
  const oldTenant = await Tenant.findOne({ name: tenantName });
  if (oldTenant) {
    const tid = oldTenant._id;
    await Tenant.deleteMany({ _id: tid });
    await User.deleteMany({ tenantId: tid });
    await Restaurant.deleteMany({ tenantId: tid });
    await Outlet.deleteMany({ tenantId: tid });
    await Category.deleteMany({ tenantId: tid });
    await MenuItem.deleteMany({ tenantId: tid });
    await Variant.deleteMany({ tenantId: tid });
    await Addon.deleteMany({ tenantId: tid });
    await Inventory.deleteMany({ tenantId: tid });
    await ChannelConnection.deleteMany({ tenantId: tid });
    await ChannelOutletMapping.deleteMany({ tenantId: tid });
    await ChannelMenuItemMapping.deleteMany({ tenantId: tid });
    await ChannelVariantMapping.deleteMany({ tenantId: tid });
    await ChannelAddonMapping.deleteMany({ tenantId: tid });
    await ExternalOrder.deleteMany({ tenantId: tid });
    await Order.deleteMany({ tenantId: tid });
    await OrderItem.deleteMany({ tenantId: tid });
    await OrderTimeline.deleteMany({ tenantId: tid });
    await IntegrationEventQueue.deleteMany({ tenantId: tid });
    await SyncJob.deleteMany({ tenantId: tid });
    await ProviderSyncState.deleteMany({ tenantId: tid });
    await Notification.deleteMany({ tenantId: tid });
    await Customer.deleteMany({ tenantId: tid });
    await Cart.deleteMany({ tenantId: tid });
    await Table.deleteMany({ tenantId: tid });
    await DiningArea.deleteMany({ tenantId: tid });
  }

  console.log("Seeding Regression Test baseline...");
  const tenantId = new mongoose.Types.ObjectId();
  const userId = new mongoose.Types.ObjectId();

  await Tenant.create({
    _id: tenantId,
    name: tenantName,
    slug: `e2e-regression-${Date.now()}`,
    ownerId: userId,
    status: "ACTIVE"
  });

  const hashedPassword = await bcrypt.hash("admin123", 10);
  const user = await User.create({
    _id: userId,
    tenantId,
    firstName: "Regression",
    lastName: "Tester",
    email: `regression-${Date.now()}@foodmesh.io`,
    passwordHash: hashedPassword,
    role: "RESTAURANT_OWNER",
    status: "ACTIVE"
  });

  const restaurant = await Restaurant.create({
    tenantId,
    name: "Regression KFC",
    status: "ACTIVE"
  });

  const outlet = await Outlet.create({
    tenantId,
    restaurantId: restaurant._id,
    name: "Regression KFC Bhopal",
    code: "REG-BHP",
    email: "reg-bhp@example.com",
    phone: "9988776655",
    address: "Regression Street, Bhopal",
    city: "Bhopal",
    state: "MP",
    pincode: "462001",
    isActive: true
  });
  const outletId = outlet._id;
  const outletSlug = outlet.slug;

  const category = await Category.create({
    tenantId,
    outletId,
    name: "Burgers & Sides",
    isActive: true
  });

  const burgerItem = await MenuItem.create({
    tenantId,
    categoryId: category._id,
    outletId,
    name: "Veg Classic Burger",
    price: 180,
    isActive: true,
    outlets: [outletId]
  });

  const cheeseVariant = await Variant.create({
    tenantId,
    menuItemId: burgerItem._id,
    name: "Regular Cheese",
    price: 30,
    isActive: true
  });

  const jalapenoAddon = await Addon.create({
    tenantId,
    menuItemId: burgerItem._id,
    name: "Jalapenos Extra",
    price: 20,
    isActive: true
  });

  const inventory = await Inventory.create({
    tenantId,
    outletId,
    menuItemId: burgerItem._id,
    quantity: 100,
    minThreshold: 5,
    status: "IN_STOCK"
  });

  // Connections and Mappings
  const swiggyConn = await ChannelConnection.create({
    tenantId,
    provider: "MOCK_SWIGGY",
    name: "Regression Swiggy",
    status: "ACTIVE",
    capabilities: { inboundOrders: true, statusSync: true, menuSync: true, inventorySync: true }
  });

  const zomatoConn = await ChannelConnection.create({
    tenantId,
    provider: "MOCK_ZOMATO",
    name: "Regression Zomato",
    status: "ACTIVE",
    capabilities: { inboundOrders: true, statusSync: true, menuSync: true, inventorySync: true }
  });

  const extOutletId = "6a3c17666bb70afe757e4a91";

  await ChannelOutletMapping.create([
    { tenantId, outletId, connectionId: swiggyConn._id, provider: "MOCK_SWIGGY", externalOutletId: extOutletId, isActive: true },
    { tenantId, outletId, connectionId: zomatoConn._id, provider: "MOCK_ZOMATO", externalOutletId: extOutletId, isActive: true }
  ]);

  await ChannelMenuItemMapping.create([
    { tenantId, outletId, provider: "MOCK_SWIGGY", externalItemId: "1001", menuItemId: burgerItem._id, isActive: true },
    { tenantId, outletId, provider: "MOCK_ZOMATO", externalItemId: "2002", menuItemId: burgerItem._id, isActive: true }
  ]);

  await ChannelVariantMapping.create([
    { tenantId, outletId, menuItemId: burgerItem._id, provider: "MOCK_SWIGGY", externalVariantId: "V201", variantId: cheeseVariant._id, isActive: true },
    { tenantId, outletId, menuItemId: burgerItem._id, provider: "MOCK_ZOMATO", externalVariantId: "V201", variantId: cheeseVariant._id, isActive: true }
  ]);

  await ChannelAddonMapping.create([
    { tenantId, outletId, menuItemId: burgerItem._id, provider: "MOCK_SWIGGY", externalAddonId: "A402", addonId: jalapenoAddon._id, isActive: true },
    { tenantId, outletId, menuItemId: burgerItem._id, provider: "MOCK_ZOMATO", externalAddonId: "A402", addonId: jalapenoAddon._id, isActive: true }
  ]);

  // QR Dine In Seeding
  const diningArea = await DiningArea.create({ tenantId, outletId, name: "Indoor Area", isActive: true });
  const qrTable = await Table.create({
    tenantId,
    outletId,
    diningAreaId: diningArea._id,
    tableNumber: "T-REG",
    seatCount: 2,
    status: "ACTIVE"
  });

  console.log("Seeding completed successfully.");

  const PORT = 5006;
  const server = app.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}`);

    try {
      const orderSources = ["MOCK_SWIGGY", "MOCK_ZOMATO", "WEBSITE", "QR"];

      for (const source of orderSources) {
        console.log(`\n=========================================`);
        console.log(`RUNNING E2E TRANSITIONS FOR SOURCE: ${source}`);
        console.log(`=========================================`);

        let internalOrderId: string = "";
        let initialInventoryQty = (await Inventory.findOne({ menuItemId: burgerItem._id, outletId }))?.quantity || 100;

        // 1. Placement / Ingestion
        if (source === "MOCK_SWIGGY") {
          const swRes = await fetch(`http://localhost:${PORT}/api/v1/integrations/mock/swiggy/orders?tenantId=${tenantId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              order_id: `REG-SW-${Date.now()}`,
              outlet_id: extOutletId,
              customer: { name: "Swiggy Customer", phone: "9876543200" },
              items: [{ item_id: "1001", name: burgerItem.name, quantity: 2, price: 180, variant_id: "V201" }],
              pricing: { subtotal: 360, total_amount: 360 }
            })
          });
          const resBody: any = await swRes.json();
          if (swRes.status !== 201) throw new Error(`Swiggy ingestion failed: ${JSON.stringify(resBody)}`);
          internalOrderId = resBody.data.internalOrderId;
        } else if (source === "MOCK_ZOMATO") {
          const zmRes = await fetch(`http://localhost:${PORT}/api/v1/integrations/mock/zomato/orders?tenantId=${tenantId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: `REG-ZM-${Date.now()}`,
              outletCode: extOutletId,
              customerDetails: { customerName: "Zomato Customer", customerPhone: "9876543201" },
              cart: { items: [{ itemId: "2002", title: burgerItem.name, qty: 2, rate: 180, variantId: "V201" }] },
              billDetails: { itemSubTotal: 360, totalBill: 360 }
            })
          });
          const resBody: any = await zmRes.json();
          if (zmRes.status !== 201) throw new Error(`Zomato ingestion failed: ${JSON.stringify(resBody)}`);
          internalOrderId = resBody.data.internalOrderId;
        } else if (source === "WEBSITE") {
          // Website Checkout flow
          const customer = await Customer.create({ tenantId, firstName: "Web", lastName: "Customer", email: "web@example.com", phone: "9876543202" });
          const cart = await Cart.create({
            tenantId,
            outletId,
            sessionToken: `WEB-SESS-${Date.now()}`,
            status: "ACTIVE",
            items: [{ menuItemId: burgerItem._id, variantId: cheeseVariant._id, addons: [], quantity: 2 }]
          });
          const checkRes = await fetch(`http://localhost:${PORT}/api/public/checkout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cartId: cart._id.toString(),
              customer: { name: "Web Customer", phone: "9876543202", email: "web@example.com" },
              fulfillment: { type: "DELIVERY", instructions: "Ring bell" },
              payment: { mode: "ONLINE", transactionId: "TXN-WEB-REG" }
            })
          });
          const resBody: any = await checkRes.json();
          if (checkRes.status !== 201) throw new Error(`Website checkout failed: ${JSON.stringify(resBody)}`);
          internalOrderId = resBody.data.processedOrder.internalOrderId;
        } else if (source === "QR") {
          // QR order placement
          const qrRes = await fetch(`http://localhost:${PORT}/api/public/qr/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tableToken: qrTable.qrToken,
              seatNumber: "1",
              customer: { name: "QR Customer", phone: "9876543203" },
              items: [{ itemId: burgerItem._id.toString(), name: burgerItem.name, quantity: 2, price: 180 }]
            })
          });
          const resBody: any = await qrRes.json();
          if (qrRes.status !== 201 && qrRes.status !== 200) throw new Error(`QR order placement failed: ${JSON.stringify(resBody)}`);
          internalOrderId = resBody.data.internalOrderId;
        }

        console.log(`Placed order internally with ID: ${internalOrderId}`);

        // Verify PENDING state, OrderTimeline, Event Queue, Notification
        const order = await Order.findById(internalOrderId);
        if (!order) throw new Error(`Order ${internalOrderId} not found in DB`);
        if (order.orderStatus !== "PENDING") throw new Error(`Expected PENDING status, got ${order.orderStatus}`);

        const timeline = await OrderTimeline.find({ orderId: internalOrderId, status: "PENDING" });
        if (timeline.length === 0) throw new Error("OrderTimeline PENDING record missing");

        const eventQueueEntry = await IntegrationEventQueue.findOne({ aggregateId: new Types.ObjectId(internalOrderId), eventType: "ORDER_CREATED" });
        if (!eventQueueEntry) throw new Error("ORDER_CREATED event bus queue entry not created");

        const notification = await Notification.findOne({ tenantId, entityId: internalOrderId, type: "ORDER_PLACED" });
        if (!notification) throw new Error("ORDER_PLACED notification missing");

        // Run outbox poller and wait for event to process to SUCCESS (resilient to concurrent background workers)
        let processedEvent = null;
        for (let attempt = 0; attempt < 30; attempt++) {
          processedEvent = await IntegrationEventQueue.findById(eventQueueEntry._id);
          if (processedEvent && (processedEvent.status === "SUCCESS" || processedEvent.status === "DLQ")) {
            break;
          }
          await OutboxPollerService.triggerManualRun();
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        if (processedEvent?.status !== "SUCCESS") throw new Error(`Outbox event processing failed. Status: ${processedEvent?.status}`);

        // Verify sync jobs for integrations (wait for sync job to be created by worker)
        if (source === "MOCK_SWIGGY" || source === "MOCK_ZOMATO") {
          let syncJob = null;
          for (let attempt = 0; attempt < 30; attempt++) {
            syncJob = await SyncJob.findOne({ eventId: eventQueueEntry._id });
            if (syncJob && syncJob.status === "SUCCESS") {
              break;
            }
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
          if (!syncJob || syncJob.status !== "SUCCESS") throw new Error("Outbound SyncJob for ORDER_CREATED failed or missing");

          const syncState = await ProviderSyncState.findOne({ tenantId, outletId, provider: source });
          if (!syncState || syncState.syncHealth !== "HEALTHY") throw new Error("ProviderSyncState not updated as HEALTHY");
        }

        console.log(`PASSED: Order placement verification completed successfully.`);

        // Move through remaining transitions
        const workflowStages = [
          { status: OrderStatus.ACCEPTED, notificationType: "ORDER_ACCEPTED" },
          { status: OrderStatus.PREPARING, notificationType: "ORDER_PREPARING" },
          { status: OrderStatus.READY, notificationType: "ORDER_READY" },
          { status: OrderStatus.PICKED_UP, notificationType: "GENERAL" },
          { status: OrderStatus.DELIVERED, notificationType: "ORDER_DELIVERED" }
        ];

        for (const stage of workflowStages) {
          console.log(`Advancing status to: ${stage.status}...`);

          // Update order status
          const updated = await OrderService.updateOrderStatus(internalOrderId, tenantId.toString(), stage.status as any, user._id.toString());
          if (!updated || updated.orderStatus !== stage.status) throw new Error(`Failed to advance status to ${stage.status}`);

          // Verify timeline
          const tLine = await OrderTimeline.find({ orderId: internalOrderId, status: stage.status });
          if (tLine.length === 0) throw new Error(`OrderTimeline record missing for status ${stage.status}`);

          // Wait/retry for status change event to complete processing
          let ev: any = null;
          for (let attempt = 0; attempt < 30; attempt++) {
            ev = await IntegrationEventQueue.findOne({
              aggregateId: new Types.ObjectId(internalOrderId),
              eventType: "ORDER_STATUS_CHANGED",
              "payload.orderStatus": stage.status
            });
            if (ev && (ev.status === "SUCCESS" || ev.status === "DLQ")) {
              break;
            }
            await OutboxPollerService.triggerManualRun();
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          if (!ev) throw new Error(`IntegrationEventQueue record missing for status change to ${stage.status}`);
          if (ev.status !== "SUCCESS") throw new Error(`Status change event outbox processing failed: ${ev.status}`);

          // Verify Sync Job & Provider Sync State for integrations
          if (source === "MOCK_SWIGGY" || source === "MOCK_ZOMATO") {
            let sj = null;
            for (let attempt = 0; attempt < 30; attempt++) {
              sj = await SyncJob.findOne({ eventId: ev._id });
              if (sj && sj.status === "SUCCESS") {
                break;
              }
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
            if (!sj || sj.status !== "SUCCESS") throw new Error(`SyncJob failed or missing for status transition ${stage.status}`);

            const stateObj = await ProviderSyncState.findOne({ tenantId, outletId, provider: source });
            if (!stateObj || stateObj.syncHealth !== "HEALTHY") throw new Error(`ProviderSyncState degraded during transition ${stage.status}`);
          }

          // Verify Notification
          const notif = await Notification.findOne({ tenantId, entityId: internalOrderId, type: stage.notificationType });
          if (!notif) throw new Error(`Notification missing for status transition ${stage.status} (type: ${stage.notificationType})`);

          // Verify Inventory deduction on ACCEPTED
          if (stage.status === OrderStatus.ACCEPTED) {
            const currentQty = (await Inventory.findOne({ menuItemId: burgerItem._id, outletId }))?.quantity || 0;
            if (currentQty !== initialInventoryQty - 2) {
              throw new Error(`Inventory deduction mismatch! Expected ${initialInventoryQty - 2}, found ${currentQty}`);
            }
            console.log(`PASSED: Inventory correctly decremented by 2. Current quantity: ${currentQty}`);
          }

          // Verify Customer stats update on DELIVERED
          if (stage.status === OrderStatus.DELIVERED) {
            if (source === "WEBSITE") {
              const cust = await Customer.findOne({ tenantId, firstName: "Web" });
              if (!cust || cust.totalOrders !== 1) {
                throw new Error(`Customer totalOrders stats mismatch! Expected 1, found ${cust?.totalOrders}`);
              }
              console.log(`PASSED: Customer LTV statistics updated correctly on Delivery.`);
            }
          }
        }

        console.log(`PASSED: Order lifecycle E2E transition regression tests successful for ${source}!`);
      }

      console.log(`\n=========================================`);
      console.log(`ALL COMPREHENSIVE E2E REGRESSION TESTS PASSED!`);
      console.log(`=========================================`);
    } catch (e: any) {
      console.error("\nREGRESSION TEST RUN FAILED:", e.message);
      console.error(e);
      process.exitCode = 1;
    } finally {
      console.log("Shutting down test server and disconnecting...");
      server.close();
      await mongoose.disconnect();
      console.log("Clean exit.");
      process.exit(process.exitCode || 0);
    }
  });
}

runRegressionTests().catch(err => {
  console.error("Regression test runner crash:", err);
  process.exit(1);
});
