// Configuração de ambiente para o frontend
const ENV = import.meta.env.MODE || 'development';

const ENVIRONMENTS = {
  development: {
    API_BASE_URL: 'http://localhost:5001',
    SOCKET_URL: 'http://localhost:5001',
    DEBUG: true,
    SENTRY_DSN: null
  },
  staging: {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api-staging.comandas.com',
    SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'https://api-staging.comandas.com',
    DEBUG: false,
    SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN
  },
  production: {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.comandas.com',
    SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'https://api.comandas.com',
    DEBUG: false,
    SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN
  }
};

export const ENVIRONMENT = ENVIRONMENTS[ENV] || ENVIRONMENTS.development;

// Configuração do Sentry para monitoramento de erros
export const SENTRY_CONFIG = {
  dsn: ENVIRONMENT.SENTRY_DSN,
  environment: ENV,
  integrations: [],
  tracesSampleRate: ENV === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: ENV === 'production' ? 0.1 : 1.0,
  replaysOnErrorSampleRate: ENV === 'production' ? 1.0 : 1.0,
};

// Configuração de logging
export const LOG_CONFIG = {
  level: ENVIRONMENT.DEBUG ? 'debug' : 'info',
  enableConsole: ENVIRONMENT.DEBUG,
  enableRemote: !ENVIRONMENT.DEBUG
}; 