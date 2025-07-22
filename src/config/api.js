// Configuração da API do backend para o PDV

export const API_CONFIG = {
  BASE_URL: 'http://localhost:5001',
  ENDPOINTS: {
    // Endpoints básicos
    TEST: '/api/test',
    HEALTH: '/api/health',
    
    // Mesas
    TABLES: '/api/tables',
    
    // Cardápio
    CATEGORIES: '/api/menu/categories',
    MENU_ITEMS: '/api/menu/items',
    FULL_MENU: '/api/menu/full',
    
    // Pedidos
    ORDERS: '/api/orders',
    
    // Autenticação
    AUTH: '/api/auth'
  },
  DEFAULT_ESTABLISHMENT_ID: 1
};

// Headers padrão
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

/**
 * buildApiUrl: Monta uma URL de API com query parameters.
 * @param {string} endpoint - Endpoint base da API
 * @param {object} params - Parâmetros de query
 * @returns {string} URL completa
 */
const buildApiUrl = (endpoint, params = {}) => {
  const url = new URL(API_CONFIG.BASE_URL + endpoint);
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
};

/**
 * apiRequest: Realiza uma requisição HTTP para a API do backend.
 * @param {string} endpoint - Endpoint da API
 * @param {object} options - Opções do fetch (method, headers, body, etc.)
 * @returns {Promise<any>} Resposta JSON da API
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = typeof endpoint === 'string' ? API_CONFIG.BASE_URL + endpoint : endpoint;
  
  const config = {
    headers: DEFAULT_HEADERS,
    ...options
  };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

/**
 * apiService: Serviço principal para integração com a API do backend.
 * Métodos: getTables, createTable, updateTable, deleteTable, getCategories, createCategory, ...
 */
export const apiService = {
  // Teste de conexão
  testConnection: () => 
    apiRequest(API_CONFIG.ENDPOINTS.TEST),
  
  // Health check
  healthCheck: () => 
    apiRequest(API_CONFIG.ENDPOINTS.HEALTH),
  
  // Mesas
  getTables: (establishmentId = API_CONFIG.DEFAULT_ESTABLISHMENT_ID) => 
    apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.TABLES, { establishment_id: establishmentId })),
  
  createTable: (tableData) => 
    apiRequest(API_CONFIG.ENDPOINTS.TABLES, {
      method: 'POST',
      body: JSON.stringify(tableData)
    }),
  
  updateTable: (tableId, tableData) =>
    apiRequest(`${API_CONFIG.ENDPOINTS.TABLES}/${tableId}`, {
      method: 'PUT',
      body: JSON.stringify(tableData)
    }),
  
  deleteTable: (tableId) =>
    apiRequest(`${API_CONFIG.ENDPOINTS.TABLES}/${tableId}`, {
      method: 'DELETE'
    }),
  
  // Categorias do menu
  getCategories: (establishmentId = API_CONFIG.DEFAULT_ESTABLISHMENT_ID) => 
    apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES, { establishment_id: establishmentId })),
  
  createCategory: (categoryData) => 
    apiRequest(API_CONFIG.ENDPOINTS.CATEGORIES, {
      method: 'POST',
      body: JSON.stringify(categoryData)
    }),
  
  updateCategory: (categoryId, categoryData) =>
    apiRequest(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData)
    }),
  
  deleteCategory: (categoryId) =>
    apiRequest(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${categoryId}`, {
      method: 'DELETE'
    }),
  
  // Itens do menu
  getMenuItems: (establishmentId = API_CONFIG.DEFAULT_ESTABLISHMENT_ID, categoryId = null) => {
    const params = { establishment_id: establishmentId };
    if (categoryId) params.category_id = categoryId;
    return apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.MENU_ITEMS, params));
  },
  
  createMenuItem: (itemData) => 
    apiRequest(API_CONFIG.ENDPOINTS.MENU_ITEMS, {
      method: 'POST',
      body: JSON.stringify(itemData)
    }),
  
  updateMenuItem: (itemId, itemData) =>
    apiRequest(`${API_CONFIG.ENDPOINTS.MENU_ITEMS}/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(itemData)
    }),
  
  deleteMenuItem: (itemId) =>
    apiRequest(`${API_CONFIG.ENDPOINTS.MENU_ITEMS}/${itemId}`, {
      method: 'DELETE'
    }),
  
  // Menu completo
  getFullMenu: (establishmentId = API_CONFIG.DEFAULT_ESTABLISHMENT_ID) => 
    apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.FULL_MENU, { establishment_id: establishmentId })),
  
  // Pedidos
  getOrders: (establishmentId = API_CONFIG.DEFAULT_ESTABLISHMENT_ID) => 
    apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.ORDERS, { establishment_id: establishmentId })),
  
  createOrder: (orderData) => 
    apiRequest(API_CONFIG.ENDPOINTS.ORDERS, {
      method: 'POST',
      body: JSON.stringify(orderData)
    }),
  
  updateOrderStatus: (orderId, status) =>
    apiRequest(`${API_CONFIG.ENDPOINTS.ORDERS}/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }),
  
  // Autenticação
  login: (credentials) =>
    apiRequest(`${API_CONFIG.ENDPOINTS.AUTH}/login`, {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
}; 