/**
 * FoodMesh — MongoDB Sharding & Performance Guide
 * ================================================
 *
 * SHARDING STRATEGY
 * -----------------
 * All high-volume collections are sharded on { tenantId: 1, _id: 1 }.
 * This ensures:
 *   - Data locality per tenant (most queries are tenant-scoped)
 *   - Even distribution via hashed _id
 *   - Efficient range queries within a tenant
 *
 * sh.shardCollection("foodmesh.orders",         { tenantId: 1, _id: 1 });
 * sh.shardCollection("foodmesh.orderitems",      { tenantId: 1, _id: 1 });
 * sh.shardCollection("foodmesh.menuitems",       { tenantId: 1, _id: 1 });
 * sh.shardCollection("foodmesh.notifications",   { tenantId: 1, _id: 1 });
 * sh.shardCollection("foodmesh.auditlogs",       { tenantId: 1, _id: 1 });
 * sh.shardCollection("foodmesh.webhooklogs",     { tenantId: 1, _id: 1 });
 *
 * Low-volume collections (tenants, users, subscriptions) can remain unsharded
 * or use hashed sharding on _id.
 *
 *
 * RECOMMENDED INDEXES (beyond schema-defined)
 * --------------------------------------------
 *
 * orders — compound covering indexes for dashboard queries:
 *   db.orders.createIndex({ tenantId: 1, outletId: 1, createdAt: -1, orderStatus: 1, totalAmount: 1 });
 *
 * menuitems — text search:
 *   db.menuitems.createIndex({ name: 'text', description: 'text' }, { weights: { name: 10, description: 5 } });
 *
 * outlets — partial index for active outlets only:
 *   db.outlets.createIndex({ tenantId: 1 }, { partialFilterExpression: { status: 'open', isDeleted: false } });
 *
 * refreshtokens — TTL (already in schema):
 *   db.refreshtokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
 *
 * analyticsdailies — unique upsert guard:
 *   db.analyticsdailies.createIndex({ tenantId: 1, outletId: 1, reportDate: 1 }, { unique: true });
 *
 *
 * WRITE CONCERN
 * -------------
 * Production: { w: 'majority', j: true, wtimeout: 5000 }
 * Analytics writes: { w: 1 } acceptable for best-effort metrics
 *
 *
 * READ PREFERENCE
 * ---------------
 * Dashboard & reports: secondaryPreferred
 * Order lifecycle & payments: primary (strong consistency)
 * Inventory reads: primaryPreferred
 *
 *
 * CACHING LAYER (Redis)
 * ---------------------
 * Cache the following with TTL:
 *   - Menu items per outlet          → TTL 5 min
 *   - Operating hours per outlet     → TTL 1 hr
 *   - Tenant subscription plan       → TTL 10 min
 *   - Active outlet list by city     → TTL 5 min
 *
 *
 * ARCHIVING STRATEGY
 * ------------------
 * Orders older than 12 months → archive collection (foodmesh_archive.orders)
 * AuditLogs older than 6 months → cold storage / S3 export
 * WebhookLogs processed=true older than 30 days → purge or archive
 *
 *
 * CONNECTION POOL
 * ---------------
 * MongooseModule.forRootAsync({
 *   useFactory: () => ({
 *     uri: process.env.MONGODB_URI,
 *     maxPoolSize: 20,
 *     minPoolSize: 5,
 *     serverSelectionTimeoutMS: 5000,
 *     socketTimeoutMS: 45000,
 *     family: 4,
 *   }),
 * });
 */
export {};
