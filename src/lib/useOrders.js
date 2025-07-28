import { useState, useEffect, useCallback } from 'react';
import { pedidoService } from '../dataService';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implementar endpoint para listar todos os pedidos
      // Por enquanto, vamos usar dados mockados até ter o endpoint
      const mockOrders = [
        {
          id: 1,
          mesa_id: 2,
          cliente_nome: 'João Silva',
          status: 'preparando',
          valor_total: 45.70,
          taxa_servico: 4.57,
          data_criacao: '2024-01-15T10:30:00Z',
          itens: [
            { nome: 'X-Burger', quantidade: 1, preco: 25.90 },
            { nome: 'Batata Frita', quantidade: 1, preco: 15.90 },
            { nome: 'Refrigerante', quantidade: 1, preco: 6.90 }
          ]
        },
        {
          id: 2,
          mesa_id: 4,
          cliente_nome: 'Maria Santos',
          status: 'pronto',
          valor_total: 32.80,
          taxa_servico: 3.28,
          data_criacao: '2024-01-15T11:15:00Z',
          itens: [
            { nome: 'X-Burger', quantidade: 1, preco: 25.90 },
            { nome: 'Sorvete', quantidade: 1, preco: 8.90 }
          ]
        }
      ];
      setOrders(mockOrders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    setLoading(true);
    setError(null);
    try {
      await pedidoService.atualizarStatusPedido(orderId, newStatus);
      setOrders((prev) => prev.map((order) => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const closeOrder = async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      await pedidoService.fecharPedido(orderId);
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    error,
    fetchOrders,
    updateOrderStatus,
    closeOrder,
  };
} 