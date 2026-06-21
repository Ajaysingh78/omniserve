import api from '../axios';

export const listCustomersApi = (params) => api.get('/customers', { params });
export const createCustomerApi = (data) => api.post('/customers', data);
export const getCustomerByIdApi = (id) => api.get(`/customers/${id}`);
export const updateCustomerApi = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomerApi = (id) => api.delete(`/customers/${id}`);
