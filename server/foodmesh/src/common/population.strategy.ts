/**
 * FoodMesh — Mongoose Population Strategy
 * =========================================
 * Use these pre-built populate configs when querying documents.
 * Import and spread into your Model.find() / findOne() / findById() calls.
 *
 * Principle: populate only what the consuming layer actually needs.
 * Avoid deep recursive populates; use projection to limit fields.
 */

export const POPULATE_ORDER_FULL = [
  {
    path: 'customerId',
    select: 'firstName lastName email phone',
  },
  {
    path: 'outletId',
    select: 'name address city phone',
    populate: {
      path: 'restaurantId',
      select: 'name brandName logoUrl',
    },
  },
];

export const POPULATE_ORDER_ITEM_WITH_MENU = [
  {
    path: 'menuItemId',
    select: 'name price image isVeg',
    populate: {
      path: 'categoryId',
      select: 'name',
    },
  },
];

export const POPULATE_MENU_ITEM_FULL = [
  {
    path: 'categoryId',
    select: 'name displayOrder',
  },
  {
    path: 'outletId',
    select: 'name city',
  },
];

export const POPULATE_PAYMENT_WITH_ORDER = [
  {
    path: 'orderId',
    select: 'totalAmount orderStatus customerId createdAt',
    populate: {
      path: 'customerId',
      select: 'firstName lastName phone',
    },
  },
];

export const POPULATE_OUTLET_WITH_RESTAURANT = [
  {
    path: 'restaurantId',
    select: 'name brandName logoUrl gstNumber',
  },
];

export const POPULATE_NOTIFICATION_WITH_USER = [
  {
    path: 'userId',
    select: 'firstName lastName email role',
  },
];

export const POPULATE_AUDIT_WITH_USER = [
  {
    path: 'userId',
    select: 'firstName lastName email role',
  },
];

export const POPULATE_INVENTORY_WITH_ITEM = [
  {
    path: 'menuItemId',
    select: 'name sku price isAvailable',
  },
  {
    path: 'outletId',
    select: 'name city',
  },
];

export const POPULATE_TENANT_WITH_OWNER = [
  {
    path: 'ownerId',
    select: 'firstName lastName email phone',
  },
];
