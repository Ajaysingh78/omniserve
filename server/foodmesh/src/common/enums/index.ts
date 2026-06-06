export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  TENANT_ADMIN = 'tenant_admin',
  RESTAURANT_MANAGER = 'restaurant_manager',
  OUTLET_MANAGER = 'outlet_manager',
  STAFF = 'staff',
  CUSTOMER = 'customer',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

export enum OrderStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  PREPARING = 'preparing',
  READY = 'ready',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum SubscriptionPlan {
  FREE = 'free',
  STARTER = 'starter',
  GROWTH = 'growth',
  ENTERPRISE = 'enterprise',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  TRIAL = 'trial',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export enum NotificationType {
  ORDER_PLACED = 'order_placed',
  ORDER_ACCEPTED = 'order_accepted',
  ORDER_REJECTED = 'order_rejected',
  ORDER_READY = 'order_ready',
  ORDER_DELIVERED = 'order_delivered',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  LOW_INVENTORY = 'low_inventory',
  SYSTEM_ALERT = 'system_alert',
  PROMOTIONAL = 'promotional',
}

export enum RestaurantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_APPROVAL = 'pending_approval',
}

export enum OutletStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  TEMPORARILY_CLOSED = 'temporarily_closed',
  UNDER_MAINTENANCE = 'under_maintenance',
}

export enum OrderSource {
  WEB = 'web',
  MOBILE = 'mobile',
  POS = 'pos',
  THIRD_PARTY = 'third_party',
  WHATSAPP = 'whatsapp',
}

export enum PaymentMethod {
  CASH = 'cash',
  UPI = 'upi',
  CARD = 'card',
  NET_BANKING = 'net_banking',
  WALLET = 'wallet',
  BNPL = 'bnpl',
}

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}
