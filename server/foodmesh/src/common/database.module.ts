import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from '../modules/users/user.schema';
import { Tenant, TenantSchema } from '../modules/tenants/tenant.schema';
import { Subscription, SubscriptionSchema } from '../modules/subscriptions/subscription.schema';
import { Restaurant, RestaurantSchema } from '../modules/restaurants/restaurant.schema';
import { Outlet, OutletSchema } from '../modules/outlets/outlet.schema';
import { Category, CategorySchema } from '../modules/categories/category.schema';
import { MenuItem, MenuItemSchema } from '../modules/menu-items/menu-item.schema';
import { Variant, VariantSchema } from '../modules/variants/variant.schema';
import { Addon, AddonSchema } from '../modules/addons/addon.schema';
import { Inventory, InventorySchema } from '../modules/inventory/inventory.schema';
import { Customer, CustomerSchema } from '../modules/customers/customer.schema';
import { Order, OrderSchema } from '../modules/orders/order.schema';
import { OrderItem, OrderItemSchema } from '../modules/order-items/order-item.schema';
import { Payment, PaymentSchema } from '../modules/payments/payment.schema';
import { Notification, NotificationSchema } from '../modules/notifications/notification.schema';
import { AuditLog, AuditLogSchema } from '../modules/audit-logs/audit-log.schema';
import { RefreshToken, RefreshTokenSchema } from '../modules/refresh-tokens/refresh-token.schema';
import { AnalyticsDaily, AnalyticsDailySchema } from '../modules/analytics/analytics-daily.schema';
import { ReviewAnalytics, ReviewAnalyticsSchema } from '../modules/review-analytics/review-analytics.schema';
import { WebhookLog, WebhookLogSchema } from '../modules/webhook-logs/webhook-log.schema';

export const MONGOOSE_FEATURE_MODELS = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
  { name: Tenant.name, schema: TenantSchema },
  { name: Subscription.name, schema: SubscriptionSchema },
  { name: Restaurant.name, schema: RestaurantSchema },
  { name: Outlet.name, schema: OutletSchema },
  { name: Category.name, schema: CategorySchema },
  { name: MenuItem.name, schema: MenuItemSchema },
  { name: Variant.name, schema: VariantSchema },
  { name: Addon.name, schema: AddonSchema },
  { name: Inventory.name, schema: InventorySchema },
  { name: Customer.name, schema: CustomerSchema },
  { name: Order.name, schema: OrderSchema },
  { name: OrderItem.name, schema: OrderItemSchema },
  { name: Payment.name, schema: PaymentSchema },
  { name: Notification.name, schema: NotificationSchema },
  { name: AuditLog.name, schema: AuditLogSchema },
  { name: RefreshToken.name, schema: RefreshTokenSchema },
  { name: AnalyticsDaily.name, schema: AnalyticsDailySchema },
  { name: ReviewAnalytics.name, schema: ReviewAnalyticsSchema },
  { name: WebhookLog.name, schema: WebhookLogSchema },
]);

@Module({
  imports: [MONGOOSE_FEATURE_MODELS],
  exports: [MONGOOSE_FEATURE_MODELS],
})
export class DatabaseModule {}
