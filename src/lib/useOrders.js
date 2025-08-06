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
      const response = await fetch('/api/pedidos');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOrders(data.pedidos || []);
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