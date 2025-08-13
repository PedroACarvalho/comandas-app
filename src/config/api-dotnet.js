// Configuração da API .NET para o sistema de comandas

export const API_CONFIG = {
  BASE_URL: 'http://localhost:5001', // API .NET rodando na porta 5001
  ENDPOINTS: {
    // Clientes
    CLIENTES: '/api/cliente',
    
    // Mesas
    MESAS: '/api/mesas',
    MESAS_DISPONIVEIS: '/api/mesas/disponiveis',
    
    // Categorias
    CATEGORIAS: '/api/categorias',
    
    // Itens do menu
    ITENS: '/api/itens',
    
    // Pedidos
    PEDIDOS: '/api/pedidos',
    
    // Pagamentos
    PAGAMENTOS: '/api/pagamentos',
    
    // SignalR Hub
    SIGNALR_HUB: '/comandasHub'
  }
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
 * apiRequest: Realiza uma requisição HTTP para a API .NET.
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || response.statusText}`);
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
 */
export const apiService = {
  // ===== CLIENTES =====
  criarCliente: (clienteData) => 
    apiRequest(API_CONFIG.ENDPOINTS.CLIENTES, {
      method: 'POST',
      body: JSON.stringify({
        nome: clienteData.nome,
        mesa: clienteData.mesa
      })
    }),
  
  obterCliente: (clienteId) => 
    apiRequest(`${API_CONFIG.ENDPOINTS.CLIENTES}/${clienteId}`),
  
  obterClientePorMesa: (mesa) => 
    apiRequest(`${API_CONFIG.ENDPOINTS.CLIENTES}/mesa/${mesa}`),
  
  removerCliente: (clienteId) =>
    apiRequest(`${API_CONFIG.ENDPOINTS.CLIENTES}/${clienteId}`, {
      method: 'DELETE'
    }),
  
  // ===== MESAS =====
  listarMesas: () => 
    apiRequest(API_CONFIG.ENDPOINTS.MESAS),
  
  obterMesasDisponiveis: () => 
    apiRequest(API_CONFIG.ENDPOINTS.MESAS_DISPONIVEIS),
  
  criarMesa: (mesaData) => 
    apiRequest(API_CONFIG.ENDPOINTS.MESAS, {
      method: 'POST',
      body: JSON.stringify({
        numero: mesaData.numero,
        capacidade: mesaData.capacidade
      })
    }),
  
  obterMesa: (mesaId) => 
    apiRequest(`${API_CONFIG.ENDPOINTS.MESAS}/${mesaId}`),
  
  atualizarMesa: (mesaId, mesaData) =>
    apiRequest(`${API_CONFIG.ENDPOINTS.MESAS}/${mesaId}`, {
      method: 'PUT',
      body: JSON.stringify(mesaData)
    }),
  
  removerMesa: (mesaId) =>
    apiRequest(`${API_CONFIG.ENDPOINTS.MESAS}/${mesaId}`, {
      method: 'DELETE'
    }),
  
  // ===== CATEGORIAS =====
  listarCategorias: () => 
    apiRequest(API_CONFIG.ENDPOINTS.CATEGORIAS),
  
  criarCategoria: (categoriaData) => 
    apiRequest(API_CONFIG.ENDPOINTS.CATEGORIAS, {
      method: 'POST',
      body: JSON.stringify({
        nome: categoriaData.nome,
        descricao: categoriaData.descricao
      })
    }),
  
  obterCategoria: (categoriaId) => 
    apiRequest(`${API_CONFIG.ENDPOINTS.CATEGORIAS}/${categoriaId}`),
  
  atualizarCategoria: (categoriaId, categoriaData) =>
    apiRequest(`${API_CONFIG.ENDPOINTS.CATEGORIAS}/${categoriaId}`, {
      method: 'PUT',
      body: JSON.stringify(categoriaData)
    }),
  
  removerCategoria: (categoriaId) =>
    apiRequest(`${API_CONFIG.ENDPOINTS.CATEGORIAS}/${categoriaId}`, {
      method: 'DELETE'
    }),
  
  // ===== ITENS =====
  listarItens: () => 
    apiRequest(API_CONFIG.ENDPOINTS.ITENS),
  
  criarItem: (itemData) => 
    apiRequest(API_CONFIG.ENDPOINTS.ITENS, {
      method: 'POST',
      body: JSON.stringify({
        nome: itemData.nome,
        descricao: itemData.descricao,
        preco: itemData.preco,
        categoriaId: itemData.categoriaId,
        disponivel: itemData.disponivel !== false
      })
    }),
  
  obterItem: (itemId) => 
    apiRequest(`${API_CONFIG.ENDPOINTS.ITENS}/${itemId}`),
  
  atualizarItem: (itemId, itemData) =>
    apiRequest(`${API_CONFIG.ENDPOINTS.ITENS}/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(itemData)
    }),
  
  removerItem: (itemId) =>
    apiRequest(`${API_CONFIG.ENDPOINTS.ITENS}/${itemId}`, {
      method: 'DELETE'
    }),
  
  // ===== PEDIDOS =====
  listarPedidos: () => 
    apiRequest(API_CONFIG.ENDPOINTS.PEDIDOS),
  
  criarPedido: (pedidoData) => 
    apiRequest(API_CONFIG.ENDPOINTS.PEDIDOS, {
      method: 'POST',
      body: JSON.stringify({
        clienteId: pedidoData.clienteId,
        itens: pedidoData.itens.map(item => ({
          itemId: item.itemId,
          quantidade: item.quantidade
        }))
      })
    }),
  
  obterPedido: (pedidoId) => 
    apiRequest(`${API_CONFIG.ENDPOINTS.PEDIDOS}/${pedidoId}`),
  
  obterPedidosPorCliente: (clienteId) => 
    apiRequest(`${API_CONFIG.ENDPOINTS.PEDIDOS}/cliente/${clienteId}`),
  
  atualizarStatusPedido: (pedidoId, status) =>
    apiRequest(`${API_CONFIG.ENDPOINTS.PEDIDOS}/${pedidoId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }),
  
  fecharPedido: (pedidoId) =>
    apiRequest(`${API_CONFIG.ENDPOINTS.PEDIDOS}/${pedidoId}/fechar`, {
      method: 'POST'
    }),
  
  // ===== PAGAMENTOS =====
  criarPagamento: (pagamentoData) => 
    apiRequest(API_CONFIG.ENDPOINTS.PAGAMENTOS, {
      method: 'POST',
      body: JSON.stringify({
        pedidoId: pagamentoData.pedidoId,
        valor: pagamentoData.valor,
        metodo: pagamentoData.metodo,
        status: pagamentoData.status || 'pendente'
      })
    }),
  
  obterPagamento: (pagamentoId) => 
    apiRequest(`${API_CONFIG.ENDPOINTS.PAGAMENTOS}/${pagamentoId}`),
  
  confirmarPagamento: (pagamentoId) =>
    apiRequest(`${API_CONFIG.ENDPOINTS.PAGAMENTOS}/${pagamentoId}/confirmar`, {
      method: 'POST'
    }),
  
  // ===== COMPATIBILIDADE COM API ANTIGA =====
  // Aliases para manter compatibilidade com código existente
  getTables: () => apiService.listarMesas(),
  createTable: (tableData) => apiService.criarMesa(tableData),
  updateTable: (tableId, tableData) => apiService.atualizarMesa(tableId, tableData),
  deleteTable: (tableId) => apiService.removerMesa(tableId),
  
  getCategories: () => apiService.listarCategorias(),
  createCategory: (categoryData) => apiService.criarCategoria(categoryData),
  updateCategory: (categoryId, categoryData) => apiService.atualizarCategoria(categoryId, categoryData),
  deleteCategory: (categoryId) => apiService.removerCategoria(categoryId),
  
  getMenuItems: () => apiService.listarItens(),
  createMenuItem: (itemData) => apiService.criarItem(itemData),
  updateMenuItem: (itemId, itemData) => apiService.atualizarItem(itemId, itemData),
  deleteMenuItem: (itemId) => apiService.removerItem(itemId),
  
  getOrders: () => apiService.listarPedidos(),
  createOrder: (orderData) => apiService.criarPedido(orderData),
  updateOrderStatus: (orderId, status) => apiService.atualizarStatusPedido(orderId, status)
};
