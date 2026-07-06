import { configDotenv } from "dotenv";
configDotenv({ path: ".env" });
import dns from "dns";
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.warn("Unable to set custom DNS servers, using system defaults:", e);
}

import mongoose from "mongoose";
import connectToMongoDB from "./config/db.config.js";
import Tenant from "./models/tenant.model.js";
import Restaurant from "./models/restaurant.model.js";
import User from "./models/user.model.js";
import { SubscriptionService } from "./subscription/services/subscription.service.js";
import { SubscriptionRepository } from "./subscription/repositories/subscription.repository.js";
import { SubscriptionStatus, BillingCycle, PaymentProvider } from "./subscription/enums/subscription.enum.js";
import RestaurantSubscriptionModel from "./subscription/models/restaurant-subscription.model.js";
import InvoiceModel from "./subscription/models/invoice.model.js";
import SubscriptionUsageModel from "./subscription/models/subscription-usage.model.js";
import SubscriptionPlanModel from "./subscription/models/subscription-plan.model.js";

async function runTest() {
  console.log("--- STARTING SAAS SUBSCRIPTION WORKFLOW TEST ---");
  try {
    await connectToMongoDB();
    console.log("Connected to MongoDB successfully.");

    // Seed plans first
    await SubscriptionService.seedDefaultPlans();

    // 1. Create a dummy tenant, restaurant, and owner
    const mockTenantId = new mongoose.Types.ObjectId();
    const mockRestaurantId = new mongoose.Types.ObjectId();
    const mockOwnerId = new mongoose.Types.ObjectId();

    console.log(`Step 1: Creating mock Tenant: ${mockTenantId}`);
    await Tenant.create({
      _id: mockTenantId,
      name: "Test SaaS Eatery Ltd",
      slug: `test-saas-${Date.now()}`,
      ownerId: mockOwnerId,
      status: "ACTIVE",
    });

    await Restaurant.create({
      _id: mockRestaurantId,
      tenantId: mockTenantId,
      name: "SaaS Test Bistro",
      slug: `saas-test-bistro-${Date.now()}`,
      status: "ACTIVE",
    });

    const mockOwner = await User.create({
      _id: mockOwnerId,
      tenantId: mockTenantId,
      restaurantId: mockRestaurantId,
      firstName: "SaaS",
      lastName: "Owner",
      email: `saas-owner-${Date.now()}@test.com`,
      phone: "9999988888",
      passwordHash: "Hash123MockedPassword",
      role: "RESTAURANT_OWNER",
      status: "ACTIVE",
    });
    console.log(`Mock owner created with ID: ${mockOwner._id}`);

    // 2. Test Onboarding Setup (should automatically assign FREE plan on trial)
    console.log("Step 2: Onboarding tenant...");
    const sub = await SubscriptionService.onboardTenant(mockTenantId, mockRestaurantId, mockOwnerId);
    console.log(`Onboarding complete. Plan assigned: ${sub.planId}`);

    const refreshedSub = await SubscriptionRepository.findSubscriptionByTenant(mockTenantId);
    if (!refreshedSub) {
      throw new Error("Subscription not found after onboarding");
    }

    const plan = refreshedSub.planId as any;
    console.log(`Active subscription status: ${refreshedSub.status}`);
    console.log(`Active plan slug: ${plan.slug}`);
    console.log(`Daily orders limit: ${plan.limits.monthlyOrders}`);

    if (refreshedSub.status !== SubscriptionStatus.TRIAL) {
      throw new Error(`Expected status to be TRIAL, got ${refreshedSub.status}`);
    }
    if (plan.slug !== "free") {
      throw new Error(`Expected plan slug to be free, got ${plan.slug}`);
    }

    // 3. Test Upgrade Flow
    console.log("Step 3: Upgrading plan to STARTER via Stripe...");
    const starterPlan = await SubscriptionPlanModel.findOne({ slug: "starter" });
    if (!starterPlan) throw new Error("Starter plan missing from db");

    const upgradedSub = await SubscriptionService.changeSubscriptionPlan(
      mockTenantId,
      starterPlan._id as mongoose.Types.ObjectId,
      BillingCycle.MONTHLY,
      PaymentProvider.STRIPE,
      mockOwnerId
    );

    console.log(`Plan change processed. Active status: ${upgradedSub.status}`);
    const upgradedPlan = upgradedSub.planId as any;
    console.log(`New plan slug: ${upgradedPlan.slug} (Monthly price: ₹${upgradedPlan.monthlyPrice})`);

    if (upgradedSub.status !== SubscriptionStatus.ACTIVE) {
      throw new Error(`Expected status to be ACTIVE, got ${upgradedSub.status}`);
    }
    if (upgradedPlan.slug !== "starter") {
      throw new Error(`Expected new plan to be starter, got ${upgradedPlan.slug}`);
    }

    // 4. Test invoice listing
    console.log("Step 4: Checking invoices...");
    const { invoices, total } = await SubscriptionRepository.listInvoicesByTenant(mockTenantId);
    console.log(`Found total ${total} invoices for tenant`);
    for (const inv of invoices) {
      console.log(`- Invoice ${inv.invoiceNumber}: ${inv.currency} ${inv.total} (Status: ${inv.status})`);
    }

    if (total < 2) {
      throw new Error(`Expected at least 2 invoices (trial + upgrade), got ${total}`);
    }

    // 5. Clean up test records
    console.log("Step 5: Cleaning up test data...");
    await User.deleteOne({ _id: mockOwnerId });
    await Restaurant.deleteOne({ _id: mockRestaurantId });
    await Tenant.deleteOne({ _id: mockTenantId });
    await RestaurantSubscriptionModel.deleteOne({ tenantId: mockTenantId });
    await InvoiceModel.deleteMany({ tenantId: mockTenantId });
    await SubscriptionUsageModel.deleteMany({ tenantId: mockTenantId });

    console.log("Database restored. Cleanup complete.");
    console.log("--- ALL SAAS SUBSCRIPTION WORKFLOW TESTS PASSED SUCCESSFULLY! ---");
    process.exit(0);
  } catch (error) {
    console.error("Test workflow failed:", error);
    process.exit(1);
  }
}

runTest();
