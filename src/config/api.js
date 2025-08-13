// Configuração da API .NET para o sistema de comandas
// Importar configuração da API .NET
import { API_CONFIG as DOTNET_API_CONFIG, apiService as dotnetApiService } from './api-dotnet.js';

export const API_CONFIG = {
  BASE_URL: 'http://localhost:5001', // API .NET rodando na porta 5001
  ENDPOINTS: {
    // Endpoints básicos
    TEST: '/api/test',
    HEALTH: '/api/health',
    
    // Clientes
    CLIENTES: '/api/cliente',
    
    // Mesas
    TABLES: '/api/mesas',
    MESAS_DISPONIVEIS: '/api/mesas/disponiveis',
    
    // Cardápio
    CATEGORIES: '/api/categorias',
    MENU_ITEMS: '/api/itens',
    FULL_MENU: '/api/itens',
    
    // Pedidos
    ORDERS: '/api/pedidos',
    
    // Pagamentos
    PAGAMENTOS: '/api/pagamentos',
    
    // Autenticação
    AUTH: '/api/auth',
    
    // SignalR Hub
    SIGNALR_HUB: '/comandasHub'
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
 * apiService: Serviço principal para integração com a API .NET.
 * Usa a nova API .NET com todos os endpoints atualizados.
 */
export const apiService = {
  // ===== DELEGAÇÃO PARA API .NET =====
  // Todos os métodos agora delegam para a API .NET
  
  // Teste de conexão
  testConnection: () => 
    dotnetApiService.listarMesas(), // Usar endpoint que sabemos que funciona
  
  // Health check
  healthCheck: () => 
    dotnetApiService.listarMesas(),
  
  // ===== CLIENTES =====
  criarCliente: (clienteData) => dotnetApiService.criarCliente(clienteData),
  obterCliente: (clienteId) => dotnetApiService.obterCliente(clienteId),
  obterClientePorMesa: (mesa) => dotnetApiService.obterClientePorMesa(mesa),
  removerCliente: (clienteId) => dotnetApiService.removerCliente(clienteId),
  
  // ===== MESAS =====
  getTables: () => dotnetApiService.listarMesas(),
  getMesasDisponiveis: () => dotnetApiService.obterMesasDisponiveis(),
  createTable: (tableData) => dotnetApiService.criarMesa(tableData),
  updateTable: (tableId, tableData) => dotnetApiService.atualizarMesa(tableId, tableData),
  deleteTable: (tableId) => dotnetApiService.removerMesa(tableId),
  
  // ===== CATEGORIAS =====
  getCategories: () => dotnetApiService.listarCategorias(),
  createCategory: (categoryData) => dotnetApiService.criarCategoria(categoryData),
  updateCategory: (categoryId, categoryData) => dotnetApiService.atualizarCategoria(categoryId, categoryData),
  deleteCategory: (categoryId) => dotnetApiService.removerCategoria(categoryId),
  
  // ===== ITENS =====
  getMenuItems: () => dotnetApiService.listarItens(),
  createMenuItem: (itemData) => dotnetApiService.criarItem(itemData),
  updateMenuItem: (itemId, itemData) => dotnetApiService.atualizarItem(itemId, itemData),
  deleteMenuItem: (itemId) => dotnetApiService.removerItem(itemId),
  getFullMenu: () => dotnetApiService.listarItens(),
  
  // ===== PEDIDOS =====
  getOrders: () => dotnetApiService.listarPedidos(),
  createOrder: (orderData) => dotnetApiService.criarPedido(orderData),
  updateOrderStatus: (orderId, status) => dotnetApiService.atualizarStatusPedido(orderId, status),
  obterPedido: (pedidoId) => dotnetApiService.obterPedido(pedidoId),
  obterPedidosPorCliente: (clienteId) => dotnetApiService.obterPedidosPorCliente(clienteId),
  fecharPedido: (pedidoId) => dotnetApiService.fecharPedido(pedidoId),
  
  // ===== PAGAMENTOS =====
  criarPagamento: (pagamentoData) => dotnetApiService.criarPagamento(pagamentoData),
  obterPagamento: (pagamentoId) => dotnetApiService.obterPagamento(pagamentoId),
  confirmarPagamento: (pagamentoId) => dotnetApiService.confirmarPagamento(pagamentoId),
  
  // ===== COMPATIBILIDADE COM CÓDIGO EXISTENTE =====
  // Manter métodos antigos para compatibilidade
  login: (credentials) => {
    console.warn('Login endpoint não implementado na API .NET ainda');
    return Promise.reject(new Error('Login não implementado'));
  }
}; 