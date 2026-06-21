import api from '../axios';

export const listInventoryApi = (params) => api.get('/inventory', { params });
export const createInventoryApi = (data) => api.post('/inventory', data);
export const updateInventoryQuantityApi = (id, quantity) => api.patch(`/inventory/${id}/quantity`, { quantity });
