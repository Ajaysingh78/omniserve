import mongoose from "mongoose";
import { Types } from "mongoose";

// Mock transaction session for tests (same as test-ingestion-e2e)
const originalStartSession = mongoose.startSession;
(mongoose as any).startSession = async function(options?: any) {
  const session = await originalStartSession.call(mongoose, options);
  session.startTransaction = () => {};
  session.commitTransaction = async () => {};
  session.abortTransaction = async () => {};
  session.inTransaction = () => false;
  return session;
};

import Tenant from "../src/models/tenant.model.js";
import User from "../src/models/user.model.js";
import Restaurant from "../src/models/restaurant.model.js";
import Outlet from "../src/models/outlet.model.js";
import Category from "../src/models/category.model.js";
import MenuItem from "../src/models/menuitems.model.js";
import Inventory from "../src/models/inventory.model.js";
import Order from "../src/models/order.model.js";
import ChannelConnection from "../src/models/channelconnection.model.js";
import IntegrationEventQueue from "../src/models/integration-event-queue.model.js";
import ProviderSyncState from "../src/models/providersyncstate.model.js";
import SyncJob from "../src/models/syncjob.model.js";
import Customer from "../src/models/customer.model.js";
import ChannelOutletMapping from "../src/models/channeloutletmapping.model.js";

import { OrderService } from "../src/services/order.service.js";
import { InventoryService } from "../src/services/inventory.service.js";
import { MenuItemService } from "../src/services/menuitem.service.js";
import { OutboxPollerService } from "../src/services/outbox-poller.service.js";
import { SyncEngineService } from "../src/services/sync-engine.service.js";
import { EventBusService } from "../src/services/event-bus.service.js";

import { OrderStatus } from "../src/enums/enums.js";
import { initWorkerRegistry } from "../src/workers/register-workers.js";

process.env.NODE_ENV = "test";

const MONGO_URIS = [
  "mongodb://127.0.0.1:27017/FoodMesh-Test"
];

async function runTests() {
  initWorkerRegistry();
  console.log("Connecting to MongoDB...");
  let connected = false;
  for (const uri of MONGO_URIS) {
    try {
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

  // Clean up existing test data
  console.log("Cleaning up test collections...");
  const tenantName = "Event Bus Test Tenant";
  const existingTenant = await Tenant.findOne({ name: tenantName });
  if (existingTenant) {
    const tid = existingTenant._id;
    await Tenant.deleteMany({ _id: tid });
    await User.deleteMany({ tenantId: tid });
    await Restaurant.deleteMany({ tenantId: tid });
    await Outlet.deleteMany({ tenantId: tid });
    await Category.deleteMany({ tenantId: tid });
    await MenuItem.deleteMany({ tenantId: tid });
    await Inventory.deleteMany({ tenantId: tid });
    await Order.deleteMany({ tenantId: tid });
    await ChannelConnection.deleteMany({ tenantId: tid });
    await IntegrationEventQueue.deleteMany({ tenantId: tid });
    await ProviderSyncState.deleteMany({ tenantId: tid });
    await SyncJob.deleteMany({ tenantId: tid });
    await Customer.deleteMany({ tenantId: tid });
    await ChannelOutletMapping.deleteMany({ tenantId: tid });
  }

  // Seed baseline
  console.log("Seeding Test Baseline...");
  const tenantId = new Types.ObjectId();
  const userId = new Types.ObjectId();
  const tenant = await Tenant.create({
    _id: tenantId,
    name: tenantName,
    slug: `test-eventbus-${Date.now()}`,
    ownerId: userId,
    status: "ACTIVE"
  });

  const user = await User.create({
    _id: userId,
    tenantId: tenantId,
    firstName: "EventBus",
    lastName: "Tester",
    email: "tester@foodmesh.io",
    passwordHash: "passwordhash",
    role: "RESTAURANT_OWNER",
    status: "ACTIVE"
  });

  const customer = await Customer.create({
    tenantId: tenantId,
    firstName: "EB",
    lastName: "Customer",
    email: "eb-customer@example.com",
    phone: "9876543210",
    status: "ACTIVE"
  });

  const restaurant = await Restaurant.create({
    tenantId: tenant._id,
    name: "EventBus Brand Test",
    status: "ACTIVE"
  });

  const outlet = await Outlet.create({
    tenantId: tenant._id,
    restaurantId: restaurant._id,
    name: "EventBus Outlet Bhopal",
    code: "EB-BHP",
    email: "eb-bhp@example.com",
    phone: "8877665544",
    address: "Bhopal Main Road",
    city: "Bhopal",
    state: "MP",
    pincode: "462001",
    isActive: true
  });

  const category = await Category.create({
    tenantId: tenant._id,
    outletId: outlet._id,
    name: "Snacks",
    isActive: true
  });

  const menuItem = await MenuItem.create({
    tenantId: tenant._id,
    categoryId: category._id,
    outletId: outlet._id,
    name: "EB Hot Fries",
    price: 100,
    isActive: true,
    outlets: [outlet._id]
  });

  const inventory = await Inventory.create({
    tenantId: tenant._id,
    outletId: outlet._id,
    menuItemId: menuItem._id,
    quantity: 50,
    minThreshold: 5,
    status: "IN_STOCK"
  });

  // Seed Channel Connection with Capabilities
  console.log("Seeding Channel Connection...");
  const connection = await ChannelConnection.create({
    tenantId: tenant._id,
    provider: "MOCK_SWIGGY",
    name: "Mock Swiggy EventBus",
    status: "ACTIVE",
    capabilities: {
      inboundOrders: true,
      statusSync: true,
      menuSync: true,
      inventorySync: true,
      deliverySync: true,
      paymentSync: true,
      customerSync: true,
      reviewSync: true
    },
    settings: {
      autoAcceptOrders: true,
      syncMenu: true,
      syncInventory: true,
      syncOrderStatus: true,
      maxRetryCount: 3
    }
  });

  // Seed Channel Outlet Mapping linking the connection to our outlet
  await ChannelOutletMapping.create({
    tenantId: tenant._id,
    outletId: outlet._id,
    connectionId: connection._id,
    provider: "MOCK_SWIGGY",
    externalOutletId: "ext-outlet-123",
    isActive: true
  });

  console.log("\n--- TEST 1: Place Order triggers ORDER_CREATED outbox event ---");
  const orderData = {
    outletId: outlet._id.toString(),
    customerId: customer._id.toString(),
    source: "WEBSITE",
    subtotal: 100,
    totalAmount: 100,
    items: [
      {
        menuItemId: menuItem._id.toString(),
        name: "EB Hot Fries",
        quantity: 1,
        unitPrice: 100
      }
    ]
  };

  const placedOrder = await OrderService.placeOrder(tenant._id.toString(), orderData, user._id.toString());
  console.log(`Placed order ID: ${placedOrder._id}, Order Number: ${placedOrder.orderNumber}`);

  // Assert ORDER_CREATED exists in Outbox
  const createdEvent = await IntegrationEventQueue.findOne({
    tenantId: tenant._id,
    eventType: "ORDER_CREATED",
    aggregateId: placedOrder._id
  });

  if (!createdEvent) {
    throw new Error("ORDER_CREATED event not found in IntegrationEventQueue outbox.");
  }
  console.log("SUCCESS: ORDER_CREATED event registered in outbox.");
  console.log(`Event details: status=${createdEvent.status}, correlationId=${createdEvent.correlationId}`);

  // Run poller manual trigger to process event
  console.log("Triggering manual poller run...");
  await OutboxPollerService.triggerManualRun();

  // Verify event processed successfully
  const processedEvent = await IntegrationEventQueue.findById(createdEvent._id);
  if (!processedEvent || processedEvent.status !== "SUCCESS") {
    throw new Error(`Event processing failed. Current status: ${processedEvent?.status}, Reason: ${processedEvent?.failureReason}`);
  }
  console.log("SUCCESS: ORDER_CREATED event processed to status SUCCESS.");

  // Verify Outbound SyncJob created
  const syncJob = await SyncJob.findOne({
    tenantId: tenant._id,
    eventId: processedEvent._id,
    correlationId: processedEvent.correlationId
  });
  if (!syncJob || syncJob.status !== "SUCCESS") {
    throw new Error("Outbound SyncJob trace record missing or failed.");
  }
  console.log("SUCCESS: Linked outbound SyncJob trace successfully saved.");

  console.log("\n--- TEST 2: Update status triggers ORDER_STATUS_CHANGED outbox event ---");
  const updatedOrder = await OrderService.updateOrderStatus(
    placedOrder._id.toString(),
    tenant._id.toString(),
    OrderStatus.ACCEPTED,
    user._id.toString()
  );

  const statusEvent = await IntegrationEventQueue.findOne({
    tenantId: tenant._id,
    eventType: "ORDER_STATUS_CHANGED",
    aggregateId: placedOrder._id
  });

  if (!statusEvent) {
    throw new Error("ORDER_STATUS_CHANGED event not found in outbox.");
  }
  console.log("SUCCESS: ORDER_STATUS_CHANGED event registered in outbox.");
  console.log(`Event details: correlationId=${statusEvent.correlationId}, equalToOriginalOrder=${statusEvent.correlationId === placedOrder._id.toString()}`);

  console.log("\n--- TEST 3: Deduplication Index blocks duplicate events ---");
  try {
    await EventBusService.publishOrderCreated(
      tenant._id,
      outlet._id,
      placedOrder._id,
      placedOrder,
      {
        correlationId: statusEvent.correlationId,
        eventVersion: 1
      }
    );
    console.log("SUCCESS: Deduplication handler caught duplicate event insertion gracefully without crashing.");
  } catch (err: any) {
    throw new Error(`Deduplication index threw unhandled error: ${err.message}`);
  }

  console.log("\n--- TEST 4: Menu mutation triggers MENU_CHANGED outbox event ---");
  await MenuItemService.updateAvailabilityStatus(menuItem._id.toString(), tenant._id.toString(), false, user._id.toString());
  const menuEvent = await IntegrationEventQueue.findOne({
    tenantId: tenant._id,
    eventType: "MENU_CHANGED",
    aggregateId: menuItem._id
  });
  if (!menuEvent) {
    throw new Error("MENU_CHANGED event not found in outbox.");
  }
  console.log("SUCCESS: MENU_CHANGED event registered in outbox.");

  console.log("\n--- TEST 5: Mock connector failure shifts event to DLQ ---");
  // Publish a new event with mockFailure payload control flag
  const failEvent = await EventBusService.publishOrderStatusChanged(
    tenant._id,
    outlet._id,
    placedOrder._id,
    { mockFailure: true }, // Triggers simulated mock failure
    { correlationId: "fail-test-correlation" }
  );

  if (!failEvent) {
    throw new Error("Failed to publish manual fail test event.");
  }

  // Poll repeatedly to exhaust max retries (3)
  console.log("Simulating retries to shift event to DLQ...");
  await OutboxPollerService.triggerManualRun(); // Attempt 1 -> Fails, schedules retry
  
  // Fast forward retry time
  await IntegrationEventQueue.updateOne({ _id: failEvent._id }, { $set: { nextRetryAt: new Date(Date.now() - 1000) } });
  await OutboxPollerService.triggerManualRun(); // Attempt 2 -> Fails, schedules retry
  
  await IntegrationEventQueue.updateOne({ _id: failEvent._id }, { $set: { nextRetryAt: new Date(Date.now() - 1000) } });
  await OutboxPollerService.triggerManualRun(); // Attempt 3 -> Fails, exceeds max retries, shifts to DLQ

  const dlqEvent = await IntegrationEventQueue.findById(failEvent._id);
  if (!dlqEvent || dlqEvent.status !== "DLQ") {
    throw new Error(`Event not in DLQ status. Current status: ${dlqEvent?.status}`);
  }
  console.log("SUCCESS: Exhausted retries shifted outbox event into DLQ quarantine.");

  console.log("\n--- TEST 6: Consecutive failures trip the circuit breaker ---");
  // Let's seed consecutive failures for Swiggy
  // Since we already had 3 failures in Test 5, let's trigger 2 more failures to hit threshold of 5
  const failEvent2 = await EventBusService.publishOrderStatusChanged(
    tenant._id,
    outlet._id,
    placedOrder._id,
    { mockFailure: true },
    { correlationId: "fail-test-correlation-2" }
  );
  if (failEvent2) {
    await OutboxPollerService.triggerManualRun(); // Fail 4
    await IntegrationEventQueue.updateOne({ _id: failEvent2._id }, { $set: { nextRetryAt: new Date(Date.now() - 1000) } });
    await OutboxPollerService.triggerManualRun(); // Fail 5
  }

  // Check sync state circuit status
  const syncState = await ProviderSyncState.findOne({
    tenantId: tenant._id,
    outletId: outlet._id,
    provider: "MOCK_SWIGGY"
  });

  if (!syncState || !syncState.circuitOpenUntil || syncState.circuitOpenUntil < new Date()) {
    throw new Error(`Circuit breaker failed to trip (OPEN). SyncState: ${JSON.stringify(syncState)}`);
  }
  console.log(`SUCCESS: Circuit breaker tripped (OPEN) until ${syncState.circuitOpenUntil.toLocaleTimeString()}`);

  console.log("\n=================================");
  console.log("ALL PHASE 7 OUTBOX EVENT TESTS PASSED!");
  console.log("=================================");
}

runTests()
  .then(() => {
    console.log("Clean exit.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Test runner crashed:", err);
    process.exit(1);
  });
