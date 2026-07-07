import api from '../axios';

export const getMappingsHealthApi = (params) => api.get('/integrations/mappings/health', { params });
export const getUnmappedItemsApi = (provider, params) => api.get('/integrations/mappings/unmapped', { params: { ...params, provider } });
export const getExternalOrdersApi = (params) => api.get('/integrations/external-orders', { params });
export const replayOrderApi = (id, params) => api.post(`/integrations/external-orders/${id}/replay`, {}, { params });

// Mock provider simulators (n8n/Postman equivalent inside Dashboard!)
export const simulateMockSwiggyOrderApi = (payload, params) => api.post('/integrations/mock/swiggy/orders', payload, { params });
export const simulateMockZomatoOrderApi = (payload, params) => api.post('/integrations/mock/zomato/orders', payload, { params });

// Phase 7 Event Bus & Sync Engine
export const getIntegrationStatsApi = (params) => api.get('/integrations/stats', { params });
export const getIntegrationEventsApi = (params) => api.get('/integrations/events', { params });
export const getSyncJobsApi = (params) => api.get('/integrations/sync-jobs', { params });
export const replayEventApi = (id, params) => api.post(`/integrations/events/${id}/replay`, {}, { params });
