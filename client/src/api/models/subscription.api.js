import api from '../axios';

export const getCurrentSubscriptionApi = () => api.get('/subscriptions/current');
export const listSubscriptionsApi = () => api.get('/subscriptions');
export const createSubscriptionApi = (data) => api.post('/subscriptions', data);
export const cancelSubscriptionApi = (id) => api.patch(`/subscriptions/${id}/cancel`);
