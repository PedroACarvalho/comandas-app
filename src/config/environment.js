/**
 * Configuração de ambiente para o sistema de comandas
 * Centraliza todas as configurações baseadas no ambiente
 */

const ENV = import.meta.env.MODE || 'development';

const config = {
  development: {
    apiBaseUrl: 'http://localhost:5001',
    socketUrl: 'http://localhost:5001',
    debug: true,
    logLevel: 'debug',
    features: {
      realTimeUpdates: true,
      offlineMode: false,
      analytics: false
    }
  },
  
  staging: {
    apiBaseUrl: 'https://staging-api.comandas.com',
    socketUrl: 'https://staging-api.comandas.com',
    debug: false,
    logLevel: 'info',
    features: {
      realTimeUpdates: true,
      offlineMode: true,
      analytics: true
    }
  },
  
  production: {
    apiBaseUrl: 'https://api.comandas.com',
    socketUrl: 'https://api.comandas.com',
    debug: false,
    logLevel: 'warn',
    features: {
      realTimeUpdates: true,
      offlineMode: true,
      analytics: true
    }
  }
};

// Configuração atual baseada no ambiente
const currentConfig = config[ENV] || config.development;

// Configurações específicas que podem ser sobrescritas por variáveis de ambiente
const envConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || currentConfig.apiBaseUrl,
  socketUrl: import.meta.env.VITE_SOCKET_URL || currentConfig.socketUrl,
  debug: import.meta.env.VITE_DEBUG === 'true' || currentConfig.debug,
  logLevel: import.meta.env.VITE_LOG_LEVEL || currentConfig.logLevel,
  features: {
    realTimeUpdates: import.meta.env.VITE_REAL_TIME_UPDATES !== 'false' && currentConfig.features.realTimeUpdates,
    offlineMode: import.meta.env.VITE_OFFLINE_MODE === 'true' || currentConfig.features.offlineMode,
    analytics: import.meta.env.VITE_ANALYTICS === 'true' || currentConfig.features.analytics
  }
};

// Função para obter configuração
export const getConfig = (key) => {
  return envConfig[key] || currentConfig[key];
};

// Função para verificar se uma feature está habilitada
export const isFeatureEnabled = (featureName) => {
  return envConfig.features[featureName] || false;
};

// Função para obter URL da API
export const getApiUrl = (endpoint = '') => {
  const baseUrl = envConfig.apiBaseUrl.replace(/\/$/, '');
  const cleanEndpoint = endpoint.replace(/^\//, '');
  return `${baseUrl}/${cleanEndpoint}`;
};

// Função para obter URL do WebSocket
export const getSocketUrl = () => {
  return envConfig.socketUrl;
};

// Função para logging baseada no nível configurado
export const log = (level, message, ...args) => {
  if (envConfig.debug || level === 'error') {
    const timestamp = new Date().toISOString();
    console[level](`[${timestamp}] ${message}`, ...args);
  }
};

// Configuração exportada por padrão
export default envConfig;

// Exportar configurações específicas para uso direto
export const {
  apiBaseUrl,
  socketUrl,
  debug,
  logLevel,
  features
} = envConfig; 