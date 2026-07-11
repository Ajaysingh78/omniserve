/**
 * Configuration manager for VectorDB (Qdrant), GraphDB (Neo4j), and LLM (Gemini).
 */
export interface IRagConfig {
  gemini: {
    apiKey: string;
    modelName: string;
  };
  qdrant: {
    url: string;
    apiKey: string;
    collectionName: string;
  };
  neo4j: {
    uri: string;
    user: string;
    password: string;
  };
}

export const RAG_CONFIG: IRagConfig = {
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    modelName: process.env.GEMINI_MODEL_NAME || 'gemini-1.5-flash',
  },
  qdrant: {
    url: process.env.QDRANT_URL || 'http://localhost:6333',
    apiKey: process.env.QDRANT_API_KEY || '',
    collectionName: process.env.QDRANT_COLLECTION || 'omniserve_unstructured',
  },
  neo4j: {
    uri: process.env.NEO4J_URI || 'bolt://localhost:7687',
    user: process.env.NEO4J_USER || 'neo4j',
    password: process.env.NEO4J_PASSWORD || 'password',
  },
};

/**
 * Validates that the required environment variables are present.
 * Logs a warning if any are missing.
 */
export function validateRagConfig(): void {
  const missing: string[] = [];
  if (!RAG_CONFIG.gemini.apiKey) missing.push('GEMINI_API_KEY');
  if (!RAG_CONFIG.qdrant.url) missing.push('QDRANT_URL');
  if (!RAG_CONFIG.neo4j.uri) missing.push('NEO4J_URI');

  if (missing.length > 0) {
    console.warn(`[RAG Config Warning] The following environment variables are missing: ${missing.join(', ')}. Some RAG services may not function correctly.`);
  }
}
