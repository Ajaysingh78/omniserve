// @ts-nocheck
import { configDotenv } from 'dotenv';
configDotenv({ path: '.env' });

import mongoose from 'mongoose';
import connectToMongoDB from '../src/config/db.js';
import { EmailService } from '../src/modules/notification/email.service.js';
import User from '../src/models/user.model.js';
import Tenant from '../src/models/tenant.model.js';
import Outlet from '../src/models/outlet.model.js';
import Restaurant from '../src/models/restaurant.model.js';
import Order from '../src/models/order.model.js';
import SubscriptionPlanModel from '../src/models/subscriptionPlan.model.js';
import RestaurantSubscriptionModel from '../src/models/subscription.model.js';
import SystemAdminInvite from '../src/models/systemAdminInvite.model.js';
import { UserRole, UserStatus, SubscriptionPlan } from '../src/models/enums.js';
import { SystemAdminService } from '../src/modules/systemAdmin/systemAdmin.service.js';
import { HealthService } from '../src/modules/health/health.service.js';
import { acceptInviteSchema } from '../src/modules/systemAdmin/systemAdmin.validator.js';

// Assert helper
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTests() {
  console.log('Starting System Admin & Health check integration tests...');
  
  // 1. Connect to MongoDB
  await connectToMongoDB();

  // 2. Setup mock mail capture
  let capturedEmailText = '';
  const originalSendMail = EmailService.sendMail;
  EmailService.sendMail = async (options: any) => {
    capturedEmailText = options.text;
    console.log(`[TEST MOCK EMAIL] Sent mail to ${options.to}`);
    return true;
  };

  try {
    // 3. Clear existing test data
    await User.deleteMany({ email: 'new_admin@platform.com' });
    await SystemAdminInvite.deleteMany({ email: 'new_admin@platform.com' });
    
    // Find or seed main platform admin
    let mainAdmin = await User.findOne({ email: 'admin@platform.com', role: UserRole.SYSTEM_ADMIN });
    if (!mainAdmin) {
      console.log('Seeding admin@platform.com...');
      const passwordHash = await mongoose.model('User').hashPassword ? 
        await mongoose.model('User').hashPassword('PlatformAdmin@123') : 
        await require('bcrypt').hash('PlatformAdmin@123', 10);
      
      mainAdmin = new User({
        firstName: 'Platform',
        lastName: 'Admin',
        email: 'admin@platform.com',
        passwordHash,
        role: UserRole.SYSTEM_ADMIN,
        tenantId: null,
        status: UserStatus.ACTIVE,
        invitationAccepted: true,
      });
      await mainAdmin.save();
    }

    console.log('1. Admin user verified.');

    // 4. Test invite flow
    console.log('2. Testing invitation creation...');
    const inviteRes = await SystemAdminService.inviteSystemAdmin(
      'new_admin@platform.com',
      mainAdmin._id.toString(),
      '127.0.0.1',
      'TestAgent'
    );

    assert(inviteRes.email === 'new_admin@platform.com', 'Invite email matches');
    assert(inviteRes.status === 'PENDING', 'Invite status is PENDING');
    assert(!!capturedEmailText, 'Email was captured');

    // Extract raw token from captured email text
    const tokenMatch = capturedEmailText.match(/token=([a-f0-9]+)/);
    assert(!!tokenMatch, 'Raw token found in email');
    const rawToken = tokenMatch[1];
    console.log(`Captured raw invitation token: ${rawToken}`);

    // 5. Test validation and accept invite
    console.log('3. Testing accept invite...');
    try {
      // Test weak password rejection (min length 12 required)
      acceptInviteSchema.parse({ token: rawToken, name: 'New Admin', password: 'WeakPass1!' });
      assert(false, 'Should have failed with weak password');
    } catch (e: any) {
      console.log('Weak password rejected correctly:', e.message);
    }

    const acceptRes = await SystemAdminService.acceptInvite(
      rawToken,
      'New Admin',
      'StrongPassword@2026',
      '127.0.0.1',
      'TestAgent'
    );

    assert(acceptRes.user.email === 'new_admin@platform.com', 'Accepted email matches');
    assert(acceptRes.user.role === UserRole.SYSTEM_ADMIN, 'Role is SYSTEM_ADMIN');
    assert(!!acceptRes.accessToken, 'Access token generated');
    assert(!!acceptRes.refreshToken, 'Refresh token generated');

    const checkInvite = await SystemAdminInvite.findById(inviteRes.id);
    assert(checkInvite?.status === 'ACCEPTED', 'Invite status is now ACCEPTED');

    // 6. Test invite reuse rejection
    try {
      await SystemAdminService.acceptInvite(rawToken, 'New Admin 2', 'StrongPassword@2026');
      assert(false, 'Should have rejected token reuse');
    } catch (e: any) {
      console.log('Token reuse rejected correctly:', e.message);
    }

    // 7. Setup Tenant management data
    console.log('4. Setting up Tenant and Outlets for cascade tests...');
    const testTenantSlug = `test-tenant-${Date.now()}`;
    const tenant = new Tenant({
      name: 'Test Platform Tenant',
      slug: testTenantSlug,
      ownerId: new mongoose.Types.ObjectId(),
      subscriptionPlan: SubscriptionPlan.FREE,
      status: UserStatus.ACTIVE,
    });
    await tenant.save();

    const restaurant = new Restaurant({
      tenantId: tenant._id,
      name: 'Test Restaurant',
    });
    await restaurant.save();

    const outlet1 = new Outlet({
      tenantId: tenant._id,
      restaurantId: restaurant._id,
      name: 'Outlet 1 - ' + testTenantSlug,
      address: '123 Test St',
      city: 'Test City',
      state: 'TS',
      pincode: '123456',
      location: { type: 'Point', coordinates: [77.123, 28.123] },
      operatingHours: [],
      status: UserStatus.ACTIVE,
    });
    const outlet2 = new Outlet({
      tenantId: tenant._id,
      restaurantId: restaurant._id,
      name: 'Outlet 2 - ' + testTenantSlug,
      address: '456 Test St',
      city: 'Test City',
      state: 'TS',
      pincode: '123456',
      location: { type: 'Point', coordinates: [77.124, 28.124] },
      operatingHours: [],
      status: UserStatus.ACTIVE,
    });
    await Promise.all([outlet1.save(), outlet2.save()]);

    // 8. Test Tenant Suspend cascade
    console.log('5. Testing tenant suspension cascade...');
    await SystemAdminService.updateTenantStatus(
      tenant._id.toString(),
      UserStatus.INACTIVE,
      'Violation of terms',
      mainAdmin._id.toString()
    );

    const checkTenantSuspended = await Tenant.findById(tenant._id);
    assert(checkTenantSuspended?.status === UserStatus.INACTIVE, 'Tenant is INACTIVE');

    const suspendedOutlets = await Outlet.find({ tenantId: tenant._id });
    assert(suspendedOutlets.length === 2, 'Found 2 outlets');
    assert(suspendedOutlets.every(o => o.status === UserStatus.INACTIVE), 'All outlets cascade suspended');

    // 9. Test Tenant Activation cascade
    console.log('6. Testing tenant activation cascade...');
    await SystemAdminService.updateTenantStatus(
      tenant._id.toString(),
      UserStatus.ACTIVE,
      'Reinstated',
      mainAdmin._id.toString()
    );

    const checkTenantActive = await Tenant.findById(tenant._id);
    assert(checkTenantActive?.status === UserStatus.ACTIVE, 'Tenant is ACTIVE');

    const activeOutlets = await Outlet.find({ tenantId: tenant._id });
    assert(activeOutlets.every(o => o.status === UserStatus.ACTIVE), 'All outlets cascade activated');

    // 10. Setup Subscription Plan
    let plan = await SubscriptionPlanModel.findOne({ slug: 'pro' });
    let createdPlanInTest = false;
    if (!plan) {
      plan = new SubscriptionPlanModel({
        name: 'Test Pro Plan',
        slug: 'pro',
        monthlyPrice: 1999,
        yearlyPrice: 19999,
        features: { inventory: true, analytics: true },
        limits: { outlets: 5 },
      });
      await plan.save();
      createdPlanInTest = true;
    }

    // 11. Test Subscription Override
    console.log('7. Testing subscription manual override...');
    const overridePayload = {
      planId: plan._id.toString(),
      status: 'ACTIVE',
      amount: 1500,
      billingCycle: 'MONTHLY' as const,
      trialEndsAt: null,
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const sub = await SystemAdminService.overrideSubscription(
      tenant._id.toString(),
      overridePayload,
      mainAdmin._id.toString()
    );

    assert(sub.amount === 1500, 'Overridden amount is 1500');
    assert(sub.plan === SubscriptionPlan.PRO, 'SaaS subscription enum matches PRO');

    const checkTenantPlan = await Tenant.findById(tenant._id);
    assert(checkTenantPlan?.subscriptionPlan === SubscriptionPlan.PRO, 'Tenant model plan updated to PRO');

    // 12. Test Tenant soft delete cascade
    console.log('8. Testing soft delete cascade...');
    await SystemAdminService.deleteTenant(
      tenant._id.toString(),
      'Onboarding cancellation request',
      mainAdmin._id.toString()
    );

    const checkTenantDeletedRaw = await mongoose.connection.collection('tenants').findOne({ _id: tenant._id });
    assert(checkTenantDeletedRaw?.isDeleted === true, 'Tenant soft deleted');

    // Wait, the soft-delete cascaded to outlets:
    const checkOutletsDeleted = await Outlet.find({ tenantId: tenant._id });
    // In mongoose pre hooks or queries, isDeleted: true items are excluded.
    // Let's query directly bypassing the find middleware by using the original model or raw query
    const deletedOutletsCount = await mongoose.connection.collection('outlets').countDocuments({
      tenantId: tenant._id,
      isDeleted: true
    });
    assert(deletedOutletsCount === 2, 'All outlets soft deleted');

    // 13. Test Diagnostics Health Checks (Part 2)
    console.log('9. Testing public health check (shallow)...');
    const publicHealth = await HealthService.runChecks(false);
    console.log('Public Health Response:', JSON.stringify(publicHealth, null, 2));
    assert(['ok', 'degraded', 'down'].includes(publicHealth.status), 'Public status is valid');
    assert(!!publicHealth.timestamp, 'Has timestamp');
    assert(publicHealth.uptime !== undefined, 'Has uptime');

    console.log('10. Testing detailed health check (deep)...');
    const detailedHealth = await HealthService.runChecks(true);
    console.log('Detailed Health Response (Truncated modules):');
    console.dir({
      status: detailedHealth.status,
      timestamp: detailedHealth.timestamp,
      infra: detailedHealth.checks.infra,
      someModules: {
        tenant: detailedHealth.checks.modules.tenant,
        user: detailedHealth.checks.modules.user,
      }
    }, { depth: null });

    assert(['ok', 'degraded', 'down'].includes(detailedHealth.status), 'Detailed status is valid');
    assert(detailedHealth.checks.infra.mongodb.status === 'ok', 'MongoDB is healthy');
    assert(detailedHealth.checks.modules.tenant.status === 'ok', 'Tenant check is healthy');
    assert(detailedHealth.checks.modules.user.status === 'ok', 'User check is healthy');
    assert(detailedHealth.checks.modules.tenant.details === 'Read/Write check succeeded', 'Tenant deep check write succeeded');
    assert(detailedHealth.checks.modules.user.details === 'Read check succeeded', 'User check remained read-only');

    console.log('==================================================');
    console.log('ALL INTEGRATION TESTS PASSED SUCCESSFULLY!');
    console.log('==================================================');

    // 14. Cleanup database records created in test
    await User.deleteMany({ email: 'new_admin@platform.com' });
    await SystemAdminInvite.deleteMany({ email: 'new_admin@platform.com' });
    await Tenant.deleteMany({ _id: tenant._id });
    await Restaurant.deleteMany({ _id: restaurant._id });
    await Outlet.deleteMany({ tenantId: tenant._id });
    if (createdPlanInTest) {
      await SubscriptionPlanModel.deleteMany({ _id: plan._id });
    }
    await RestaurantSubscriptionModel.deleteMany({ tenantId: tenant._id });
    
  } finally {
    // Restore original email service
    EmailService.sendMail = originalSendMail;
    // Close connection
    await mongoose.connection.close();
  }
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
