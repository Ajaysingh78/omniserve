import api from '../axios';

export const getMappingsHealthApi = (params) => api.get('/v1/integrations/mappings/health', { params });
export const getUnmappedItemsApi = (provider, params) => api.get('/v1/integrations/mappings/unmapped', { params: { ...params, provider } });
export const getExternalOrdersApi = (params) => api.get('/v1/integrations/external-orders', { params });
export const replayOrderApi = (id, params) => api.post(`/v1/integrations/external-orders/${id}/replay`, {}, { params });

// Mock provider simulators (n8n/Postman equivalent inside Dashboard!)
export const simulateMockSwiggyOrderApi = (payload, params) => api.post('/v1/integrations/mock/swiggy/orders', payload, { params });
export const simulateMockZomatoOrderApi = (payload, params) => api.post('/v1/integrations/mock/zomato/orders', payload, { params });

// Phase 7 Event Bus & Sync Engine
export const getIntegrationStatsApi = (params) => api.get('/v1/integrations/stats', { params });
export const getIntegrationEventsApi = (params) => api.get('/v1/integrations/events', { params });
export const getSyncJobsApi = (params) => api.get('/v1/integrations/sync-jobs', { params });
export const replayEventApi = (id, params) => api.post(`/v1/integrations/events/${id}/replay`, {}, { params });

// Phase 7.5 Developer Sandbox endpoints
export const getDevConfigApi = (params) => api.get('/v1/integrations/dev/config', { params });
export const loadDemoCatalogApi = (payload) => api.post('/v1/integrations/dev/load-demo-catalog', payload);
export const generateMappingsApi = (payload) => api.post('/v1/integrations/dev/generate-mappings', payload);
export const validateMappingsApi = (payload) => api.post('/v1/integrations/dev/validate-mappings', payload);
export const resetDevSandboxApi = (payload) => api.post('/v1/integrations/dev/reset', payload);
export const simulateOrderApi = (payload) => api.post('/v1/integrations/dev/simulate-order', payload);
export const getSimulatorSessionsApi = () => api.get('/v1/integrations/dev/simulator/sessions');
export const getSimulatorMetricsApi = (sessionId) => api.get(`/v1/integrations/dev/simulator/${sessionId}/metrics`);
export const getSimulatorEventsApi = (sessionId) => api.get(`/v1/integrations/dev/simulator/${sessionId}/events`);
export const stopSimulatorSessionApi = (sessionId) => api.post(`/v1/integrations/dev/simulator/${sessionId}/stop`, {});
export const runSmokeTestApi = (payload) => api.post('/v1/integrations/dev/run-smoke-test', payload);
export const simulateDineInApi = (payload) => api.post('/v1/integrations/dev/simulate-dinein', payload);

