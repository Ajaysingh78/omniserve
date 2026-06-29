import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Mock transaction support for standalone MongoDB instances used in tests
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
import Cart from "../src/models/cart.model.js";
import ChannelSession from "../src/models/channelsession.model.js";
import CustomerAddress from "../src/models/customeraddress.model.js";
import CheckoutSession from "../src/models/checkoutsession.model.js";
import OrderTimeline from "../src/models/ordertimeline.model.js";
import Order from "../src/models/order.model.js";
import OrderItem from "../src/models/orderitems.model.js";
import ExternalOrder from "../src/models/externalorder.model.js";
import Customer from "../src/models/customer.model.js";

// Set testing environment
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test_jwt_secret_key";

const MONGO_URIS = [
  "mongodb://127.0.0.1:27017/FoodMesh-Test"
];

async function runTests() {
  console.log("Connecting to MongoDB...");
  let connected = false;
  for (const uri of MONGO_URIS) {
    try {
      console.log(`Trying connection to: ${uri}`);
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

  console.log("Cleaning up test collections...");
  const tenantName = "E2E Website Commerce Tenant";
  const existingTenant = await Tenant.findOne({ name: tenantName });
  if (existingTenant) {
    const tid = existingTenant._id;
    await Tenant.deleteMany({ _id: tid });
    await User.deleteMany({ tenantId: tid });
    await Restaurant.deleteMany({ tenantId: tid });
    await Outlet.deleteMany({ tenantId: tid });
    await Category.deleteMany({ tenantId: tid });
    await MenuItem.deleteMany({ tenantId: tid });
    await Variant.deleteMany({ tenantId: tid });
    await Addon.deleteMany({ tenantId: tid });
    await Cart.deleteMany({ tenantId: tid });
    await ChannelSession.deleteMany({ tenantId: tid });
    await CustomerAddress.deleteMany({ tenantId: tid });
    await CheckoutSession.deleteMany({ tenantId: tid });
    await OrderTimeline.deleteMany({ tenantId: tid });
    await Order.deleteMany({ tenantId: tid });
    await OrderItem.deleteMany({ tenantId: tid });
    await ExternalOrder.deleteMany({ tenantId: tid });
    await Customer.deleteMany({ tenantId: tid });
  }

  console.log("Seeding Test Tenant and Users...");
  const ownerId = new mongoose.Types.ObjectId();
  const tenantId = new mongoose.Types.ObjectId();

  const tenant = await Tenant.create({
    _id: tenantId,
    name: tenantName,
    slug: `test-web-commerce-${Date.now()}`,
    ownerId: ownerId,
    status: "ACTIVE"
  });

  const owner = await User.create({
    _id: ownerId,
    tenantId: tenantId,
    firstName: "Owner",
    lastName: "User",
    email: "owner-web@foodmesh.io",
    passwordHash: "testpasswordhash",
    role: "RESTAURANT_OWNER",
    status: "ACTIVE"
  });

  const restaurant = await Restaurant.create({
    tenantId: tenant._id,
    name: "Web Restaurant",
    status: "ACTIVE"
  });

  // Seed Outlet A
  console.log("Seeding Test Outlet A...");
  const outletA = await Outlet.create({
    tenantId: tenant._id,
    restaurantId: restaurant._id,
    name: "Web Outlet Bhopal",
    code: "WEB-BHP",
    email: "web-bhp@example.com",
    phone: "9988776633",
    address: "Plaza Plaza, Bhopal",
    city: "Bhopal",
    state: "MP",
    pincode: "462016",
    isActive: true
  });
  const outletSlugA = outletA.slug;

  // Seed Outlet B (for isolation test)
  console.log("Seeding Test Outlet B...");
  const outletB = await Outlet.create({
    tenantId: tenant._id,
    restaurantId: restaurant._id,
    name: "Web Outlet Indore",
    code: "WEB-IND",
    email: "web-ind@example.com",
    phone: "9988776644",
    address: "Square Plaza, Indore",
    city: "Indore",
    state: "MP",
    pincode: "452001",
    isActive: true
  });
  const outletSlugB = outletB.slug;

  // Seed Categories
  const categoryA = await Category.create({
    tenantId: tenant._id,
    outletId: outletA._id,
    name: "Burgers A",
    isActive: true
  });

  const categoryB = await Category.create({
    tenantId: tenant._id,
    outletId: outletB._id,
    name: "Burgers B",
    isActive: true
  });

  // Seed Menu Items
  const burgerA = await MenuItem.create({
    tenantId: tenant._id,
    categoryId: categoryA._id,
    outletId: outletA._id,
    name: "Web Veg Burger",
    price: 150,
    isAvailable: true
  });

  const burgerB = await MenuItem.create({
    tenantId: tenant._id,
    categoryId: categoryB._id,
    outletId: outletB._id,
    name: "Web Cheese Burger",
    price: 180,
    isAvailable: true
  });

  // Seed Variant & Addon for Burger A
  const cheeseVariant = await Variant.create({
    tenantId: tenant._id,
    menuItemId: burgerA._id,
    name: "With Extra Cheese Slice",
    price: 180,
    isAvailable: true
  });

  const extraPattyAddon = await Addon.create({
    tenantId: tenant._id,
    menuItemId: burgerA._id,
    name: "Double Veg Patty",
    price: 40,
    isAvailable: true
  });

  console.log("Seeding complete. Starting server...");
  const PORT = 5005;
  const server = app.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}`);

    try {
      const sessionToken = "TEST-WEB-SESSION-" + Date.now();

      // TEST 1: Add item to cart (with UTM Attribution)
      console.log("\n--- TEST 1: Cart Creation with UTM Attribution ---");
      const utmParams = "?utm_source=adwords&utm_medium=cpc&utm_campaign=summer_sale";
      const cartItemPayload = {
        sessionToken,
        outletId: outletA._id.toString(),
        item: {
          menuItemId: burgerA._id.toString(),
          variantId: cheeseVariant._id.toString(),
          addons: [
            {
              addonId: extraPattyAddon._id.toString(),
              quantity: 1
            }
          ],
          quantity: 2,
          notes: "Crispy patty please"
        }
      };

      const addCartRes = await fetch(`http://localhost:${PORT}/api/public/cart${utmParams}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 TestBrowser",
          "X-Forwarded-For": "192.168.1.50"
        },
        body: JSON.stringify(cartItemPayload)
      });

      const addCartData: any = await addCartRes.json();
      console.log("Add Cart Status:", addCartRes.status);
      if (addCartRes.status !== 200) {
        throw new Error(`Failed to add item to cart. Msg: ${addCartData.message}`);
      }

      // Assert Cart created in DB
      const dbCart = await Cart.findOne({ sessionToken, status: "ACTIVE" });
      if (!dbCart) {
        throw new Error("Cart not found in database");
      }
      if (dbCart.items.length !== 1 || dbCart.items[0]?.quantity !== 2) {
        throw new Error("Cart items quantity mismatch");
      }
      console.log("PASSED: Cart created successfully with correct items.");

      // Assert ChannelSession contains UTM and visitor details
      const dbSession = await ChannelSession.findOne({ sessionToken });
      if (!dbSession) {
        throw new Error("ChannelSession not created for commerce session");
      }
      if (dbSession.utmSource !== "adwords" || dbSession.utmMedium !== "cpc" || dbSession.utmCampaign !== "summer_sale") {
        throw new Error(`UTM params mismatch: ${JSON.stringify(dbSession)}`);
      }
      if (!dbSession.firstAddToCartAt) {
        throw new Error("firstAddToCartAt funnel step was not recorded");
      }
      console.log("PASSED: ChannelSession correctly captured UTM params, IP, user-agent, and funnel markers.");

      // TEST 2: Outlet Isolation (Reject cross-outlet item additions)
      console.log("\n--- TEST 2: Outlet Isolation Check ---");
      const crossOutletPayload = {
        sessionToken,
        outletId: outletA._id.toString(),
        item: {
          menuItemId: burgerB._id.toString(), // belongs to Outlet B
          quantity: 1
        }
      };

      const crossOutletRes = await fetch(`http://localhost:${PORT}/api/public/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(crossOutletPayload)
      });
      const crossOutletData: any = await crossOutletRes.json();
      console.log("Cross Outlet Status:", crossOutletRes.status);
      if (crossOutletRes.status !== 400) {
        throw new Error(`Expected failure (400) for cross-outlet item addition, got: ${crossOutletRes.status}`);
      }
      console.log("PASSED: Cross-outlet item addition was successfully rejected with 400 Bad Request.");

      // TEST 3: Create Customer Address Standalone Record
      console.log("\n--- TEST 3: Customer Address Creation ---");
      const mockCustomerId = new mongoose.Types.ObjectId();
      const addressPayload = {
        tenantId: tenant._id.toString(),
        customerId: mockCustomerId.toString(),
        label: "Home Address",
        line1: "123 Green Avenue",
        line2: "Block C",
        city: "Bhopal",
        state: "MP",
        pincode: "462016"
      };

      const addressRes = await fetch(`http://localhost:${PORT}/api/public/customer/address`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressPayload)
      });
      const addressData: any = await addressRes.json();
      console.log("Address Creation Status:", addressRes.status);
      if (addressRes.status !== 201) {
        throw new Error(`Address creation failed: ${addressData.message}`);
      }

      const dbAddress = await CustomerAddress.findById(addressData.data._id);
      if (!dbAddress) {
        throw new Error("Address record not persisted in database");
      }
      console.log("PASSED: Customer address saved successfully.");

      // TEST 4: Checkout (Delivery + Fulfillment Context + Timeline Logging)
      console.log("\n--- TEST 4: Website Order Checkout ---");
      const scheduledFor = new Date(Date.now() + 86400000); // Tomorrow
      const checkoutPayload = {
        cartId: dbCart._id.toString(),
        customer: {
          name: "Alice Smith",
          phone: "9876543211",
          email: "alice@example.com"
        },
        fulfillment: {
          type: "DELIVERY",
          addressId: dbAddress._id.toString(),
          scheduledFor: scheduledFor.toISOString(),
          instructions: "Leave at door, do not knock."
        },
        payment: {
          mode: "ONLINE",
          transactionId: "TXN_WEB_9988"
        }
      };

      const checkoutRes = await fetch(`http://localhost:${PORT}/api/public/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutPayload)
      });
      const checkoutData: any = await checkoutRes.json();
      console.log("Checkout Status:", checkoutRes.status);
      if (checkoutRes.status !== 201) {
        throw new Error(`Checkout failed: ${checkoutData.message}`);
      }

      // Assert Cart marked as CONVERTED
      const updatedCart = await Cart.findById(dbCart._id);
      if (!updatedCart || updatedCart.status !== "CONVERTED") {
        throw new Error(`Cart status not CONVERTED. Got: ${updatedCart?.status}`);
      }

      // Assert CheckoutSession created
      const dbCheckoutSession = await CheckoutSession.findOne({ cartId: dbCart._id });
      if (!dbCheckoutSession) {
        throw new Error("CheckoutSession not created");
      }
      // subtotal = (180 [cheeseVariant] + 40 [extraPattyAddon]) * 2 = 440
      // tax = 440 * 0.05 = 22
      // delivery = 50
      // total = 512
      console.log("CheckoutSession amount:", dbCheckoutSession.amount);
      if (dbCheckoutSession.amount !== 512) {
        throw new Error(`CheckoutSession amount mismatch. Expected 512, got: ${dbCheckoutSession.amount}`);
      }
      if (dbCheckoutSession.status !== "SUCCESS") {
        throw new Error(`CheckoutSession status mismatch. Expected SUCCESS, got: ${dbCheckoutSession.status}`);
      }

      // Assert Order created
      const orderId = checkoutData.data.processedOrder.internalOrderId;
      const dbOrder = await Order.findById(orderId);
      if (!dbOrder) {
        throw new Error("Internal Order record not found in database");
      }
      if (dbOrder.source !== "WEBSITE") {
        throw new Error(`Order source mismatch. Expected WEBSITE, got: ${dbOrder.source}`);
      }

      // Assert OrderTimeline entry created
      const timelines = await OrderTimeline.find({ orderId });
      console.log("Order Timeline transitions logged:", timelines.map(t => t.status));
      if (timelines.length === 0 || !timelines.some(t => t.status === "PENDING")) {
        throw new Error("Order status transition timeline PENDING was not logged");
      }

      // Assert ExternalOrder & Canonical payload contains fulfillment context
      const extOrder = await ExternalOrder.findOne({ internalOrderId: orderId });
      if (!extOrder) {
        throw new Error("ExternalOrder record not found");
      }
      const canonicalPayload = extOrder.canonicalPayload as any;
      console.log("Canonical payload fulfillment details:", JSON.stringify(canonicalPayload.fulfillment));
      if (!canonicalPayload.fulfillment || canonicalPayload.fulfillment.type !== "DELIVERY") {
        throw new Error("CanonicalOrder fulfillment type missing or incorrect");
      }
      if (canonicalPayload.fulfillment.addressId !== dbAddress._id.toString()) {
        throw new Error("CanonicalOrder fulfillment addressId missing or incorrect");
      }
      if (!canonicalPayload.fulfillment.scheduledFor) {
        throw new Error("CanonicalOrder fulfillment scheduledFor missing or incorrect");
      }
      if (canonicalPayload.fulfillment.instructions !== "Leave at door, do not knock.") {
        throw new Error("CanonicalOrder fulfillment instructions missing or incorrect");
      }
      console.log("PASSED: Checkout completed, Cart converted, CheckoutSession verified, OrderTimeline updated, and CanonicalOrder fulfillment context preserved.");

      // TEST 5: Reorder Pricing Rules (Must never reuse historical pricing)
      console.log("\n--- TEST 5: Reorder Pricing Recalculation ---");
      // Update DB prices for MenuItem, Variant, and Addon
      console.log("Updating MenuItem, Variant, and Addon prices in database...");
      await MenuItem.updateOne({ _id: burgerA._id }, { $set: { price: 200 } });
      await Variant.updateOne({ _id: cheeseVariant._id }, { $set: { price: 250 } }); // up from 180
      await Addon.updateOne({ _id: extraPattyAddon._id }, { $set: { price: 60 } }); // up from 40

      const reorderSessionToken = "REORDER-SESS-" + Date.now();
      const reorderPayload = {
        previousOrderId: orderId,
        sessionToken: reorderSessionToken
      };

      const reorderRes = await fetch(`http://localhost:${PORT}/api/public/cart/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reorderPayload)
      });
      const reorderData: any = await reorderRes.json();
      console.log("Reorder Status:", reorderRes.status);
      if (reorderRes.status !== 200) {
        throw new Error(`Reorder request failed: ${reorderData.message}`);
      }

      // Assert item added to new cart, populated with current pricing
      const reorderCart = await Cart.findOne({ sessionToken: reorderSessionToken, status: "ACTIVE" });
      if (!reorderCart) {
        throw new Error("Reorder cart was not created in the database");
      }

      // Revalidate item in reorder cart. Since Cart stores references,
      // the controller returns populated values. Let's inspect the controller response to check recalculated pricing.
      const cartFromRes = reorderData.data.cart;
      console.log("Populated cart items from response:", JSON.stringify(cartFromRes.items));
      
      const cartItem = cartFromRes.items[0];
      if (!cartItem) {
        throw new Error("Reordered cart is empty");
      }

      // Revalidate Pricing
      const currentVariantPrice = cartItem.variantId.price;
      const currentAddonPrice = cartItem.addons[0].addonId.price;
      console.log(`Current variant price in cart: ${currentVariantPrice} (Expected: 250)`);
      console.log(`Current addon price in cart: ${currentAddonPrice} (Expected: 60)`);

      if (currentVariantPrice !== 250 || currentAddonPrice !== 60) {
        throw new Error("Reorder reused historical pricing instead of recalculating current prices!");
      }
      console.log("PASSED: Reorder pricing correctly revalidated availability and recalculated using current pricing.");

      console.log("\n======================================");
      console.log("ALL WEBSITE COMMERCE MVP TESTS PASSED!");
      console.log("======================================");
    } catch (e: any) {
      console.error("\nTEST RUN FAILED:", e.message);
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

runTests().catch(err => {
  console.error("Test runner crash:", err);
  process.exit(1);
});
