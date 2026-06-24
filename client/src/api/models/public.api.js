import api from "../axios";

export const getPublicMenuApi = (outletSlug, params) =>
  api.get(`/public/o/${outletSlug}/menu`, { params });

export const getPublicCategoriesApi = (outletSlug) =>
  api.get(`/public/o/${outletSlug}/categories`);

export const getPublicMenuItemApi = (outletSlug, itemId) =>
  api.get(`/public/o/${outletSlug}/menu/${itemId}`);

export const getCartApi = () =>
  api.get("/public/cart");

export const createOrUpdateCartApi = (data) =>
  api.post("/public/cart", data);

export const updateCartApi = (cartId, data) =>
  api.patch(`/public/cart/${cartId}`, data);

export const removeFromCartApi = (cartId, itemId, params) =>
  api.delete(`/public/cart/${cartId}/items/${itemId}`, { params });

export const createCustomerAddressApi = (data) =>
  api.post("/public/customer/address", data);

export const checkoutCartApi = (data) =>
  api.post("/public/checkout", data);

export const trackOrderApi = (orderId) =>
  api.get(`/public/orders/track/${orderId}`);
