import '@testing-library/jest-dom';

// Mock import.meta.env para testes
global.import = global.import || {};
global.import.meta = global.import.meta || {};
global.import.meta.env = {
  MODE: 'test',
  VITE_API_BASE_URL: 'http://localhost:5001',
  VITE_SOCKET_URL: 'http://localhost:5001',
  VITE_SENTRY_DSN: null
};

// Mock para process.env
process.env.NODE_ENV = 'test';

// Mock do environment.js
jest.mock('./config/environment.js', () => ({
  ENVIRONMENT: {
    API_BASE_URL: 'http://localhost:5001',
    SOCKET_URL: 'http://localhost:5001',
    DEBUG: true,
    SENTRY_DSN: null
  },
  SENTRY_CONFIG: {
    dsn: null,
    environment: 'test',
    integrations: [],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
  },
  LOG_CONFIG: {
    level: 'debug',
    enableConsole: true,
    enableRemote: false
  }
})); 