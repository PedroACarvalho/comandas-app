/**
 * Helper para requisições fetch com tratamento de erro e resposta JSON.
 * Lança erro se a resposta não for ok.
 */
async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Erro na requisição para ${url}`);
  }
  return await res.json();
}

import { ENVIRONMENT } from './config/environment.js';

// Em desenvolvimento, usar URLs relativas para aproveitar o proxy do Vite
// Em produção, usar URLs completas
const API_BASE_URL = ENVIRONMENT.API_BASE_URL === 'http://localhost:5001' ? '' : ENVIRONMENT.API_BASE_URL;

/**
 * Serviços relacionados ao cliente (criação, consulta, remoção, mesas disponíveis)
 */
export const clienteService = {
  async criarCliente(nome, mesa) {
    return fetchJson(`${API_BASE_URL}/api/cliente`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, mesa }),
    });
  },
  async obterClientePorMesa(mesa) {
    return fetchJson(`${API_BASE_URL}/api/cliente/${mesa}`);
  },
  async removerCliente(clienteId) {
    return fetchJson(`${API_BASE_URL}/api/cliente/${clienteId}`, { method: 'DELETE' });
  },
  async listarMesasDisponiveis() {
    return fetchJson(`${API_BASE_URL}/api/mesas/disponiveis`);
  },
};

/**
 * Serviços relacionados aos itens do menu
 */
export const itemService = {
  async listarItens() {
    return fetchJson(`${API_BASE_URL}/api/itens`);
  },
  async obterItem(itemId) {
    return fetchJson(`${API_BASE_URL}/api/itens/${itemId}`);
  },
  async criarItem(item) {
    return fetchJson(`${API_BASE_URL}/api/itens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
  },
  async atualizarItem(itemId, item) {
    return fetchJson(`${API_BASE_URL}/api/itens/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
  },
  async removerItem(itemId) {
    return fetchJson(`${API_BASE_URL}/api/itens/${itemId}`, { method: 'DELETE' });
  },
};

/**
 * Serviços relacionados a pedidos
 */
export const pedidoService = {
  async criarPedido(clienteId, itens) {
    return fetchJson(`${API_BASE_URL}/api/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cliente_id: clienteId, itens }),
    });
  },
  async obterPedido(pedidoId) {
    return fetchJson(`${API_BASE_URL}/api/pedidos/${pedidoId}`);
  },
  async obterPedidoAtivoCliente(clienteId) {
    return fetchJson(`${API_BASE_URL}/api/pedidos/cliente/${clienteId}/ativo`);
  },
  async atualizarStatusPedido(pedidoId, status) {
    return fetchJson(`${API_BASE_URL}/api/pedidos/${pedidoId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  },
  async fecharPedido(pedidoId) {
    return fetchJson(`${API_BASE_URL}/api/pedidos/${pedidoId}/fechar`, { method: 'POST' });
  },
  async obterPedidosCliente(clienteId) {
    return fetchJson(`${API_BASE_URL}/api/pedidos/cliente/${clienteId}`);
  },
};

/**
 * Serviços relacionados a pagamentos
 */
export const pagamentoService = {
  async criarPagamento(pedidoId, metodo, valor) {
    return fetchJson(`${API_BASE_URL}/api/pagamentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pedido_id: pedidoId, metodo, valor }),
    });
  },
  async obterPagamento(pagamentoId) {
    return fetchJson(`${API_BASE_URL}/api/pagamentos/${pagamentoId}`);
  },
  async obterPagamentoPorPedido(pedidoId) {
    return fetchJson(`${API_BASE_URL}/api/pagamentos/pedido/${pedidoId}`);
  },
};

/**
 * Serviços CRUD para mesas (Backoffice)
 */
export async function listarMesas() {
  return fetchJson('/api/mesas');
}

export async function criarMesa(data) {
  return fetchJson('/api/mesas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

export async function editarMesa(mesa_id, data) {
  return fetchJson(`/api/mesas/${mesa_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

export async function deletarMesa(mesa_id) {
  return fetchJson(`/api/mesas/${mesa_id}`, { method: 'DELETE' });
} 