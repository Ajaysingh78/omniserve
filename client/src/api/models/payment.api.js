import api from '../axios';

export const listPaymentsApi = (params) => api.get('/payments', { params });
export const refundPaymentApi = (id, data) => api.patch(`/payments/${id}/refund`, data);
