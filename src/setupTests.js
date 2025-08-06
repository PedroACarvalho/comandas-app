import '@testing-library/jest-dom';

// Mock import.meta.env para testes
global.import = global.import || {};
global.import.meta = global.import.meta || {};
global.import.meta.env = {
  MODE: 'test',
  VITE_API_BASE_URL: 'http://localhost:5001',
  VITE_SOCKET_URL: 'http://localhost:5001'
}; 