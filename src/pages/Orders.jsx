import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Filter
} from 'lucide-react';
import { useOrders } from '../lib/useOrders';

// Status e cores dos pedidos
const orderStatuses = {
  PENDING: 'pendente',
  ACCEPTED: 'aceito',
  PREPARING: 'preparando',
  READY: 'pronto',
  DELIVERED: 'entregue',
  WAITING_PAYMENT: 'aguardando_pagamento',
  PAID: 'pago',
  FINISHED: 'finalizado',
  CANCELLED: 'cancelado'
};

const orderStatusColors = {
  [orderStatuses.PENDING]: 'bg-yellow-100 text-yellow-800',
  [orderStatuses.ACCEPTED]: 'bg-blue-100 text-blue-800',
  [orderStatuses.PREPARING]: 'bg-orange-100 text-orange-800',
  [orderStatuses.READY]: 'bg-green-100 text-green-800',
  [orderStatuses.DELIVERED]: 'bg-purple-100 text-purple-800',
  [orderStatuses.WAITING_PAYMENT]: 'bg-red-100 text-red-800',
  [orderStatuses.PAID]: 'bg-emerald-100 text-emerald-800',
  [orderStatuses.FINISHED]: 'bg-gray-100 text-gray-800',
  [orderStatuses.CANCELLED]: 'bg-red-100 text-red-800'
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

/**
 * Orders: Página de gestão de pedidos (filtros, ações, detalhes e estatísticas).
 * Sugestão: extrair modal de detalhes para componente separado se crescer.
 */
const Orders = () => {
  const { orders, loading, error, updateOrderStatus, closeOrder } = useOrders();
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  const getStatusActions = (order) => {
    switch (order.status) {
      case orderStatuses.PENDING:
        return (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => handleStatusUpdate(order.id, orderStatuses.ACCEPTED)}
            >
              Aceitar
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => handleStatusUpdate(order.id, orderStatuses.CANCELLED)}
            >
              Cancelar
            </Button>
          </div>
        );
      case orderStatuses.ACCEPTED:
        return (
          <Button 
            size="sm" 
            onClick={() => handleStatusUpdate(order.id, orderStatuses.PREPARING)}
          >
            Iniciar Preparo
          </Button>
        );
      case orderStatuses.PREPARING:
        return (
          <Button 
            size="sm" 
            onClick={() => handleStatusUpdate(order.id, orderStatuses.READY)}
          >
            Marcar Pronto
          </Button>
        );
      case orderStatuses.READY:
        return (
          <Button 
            size="sm" 
            onClick={() => handleStatusUpdate(order.id, orderStatuses.DELIVERED)}
          >
            Entregar
          </Button>
        );
      case orderStatuses.DELIVERED:
        return (
          <Button 
            size="sm" 
            onClick={() => handleStatusUpdate(order.id, orderStatuses.WAITING_PAYMENT)}
          >
            Solicitar Pagamento
          </Button>
        );
      case orderStatuses.WAITING_PAYMENT:
        return (
          <Button 
            size="sm" 
            onClick={() => handleStatusUpdate(order.id, orderStatuses.PAID)}
          >
            Marcar Pago
          </Button>
        );
      case orderStatuses.PAID:
        return (
          <Button 
            size="sm" 
            onClick={() => handleStatusUpdate(order.id, orderStatuses.FINISHED)}
          >
            Finalizar
          </Button>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Erro ao carregar pedidos: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-2">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Pedidos</h1>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-md px-3 py-1"
          >
            <option value="all">Todos</option>
            <option value={orderStatuses.PENDING}>Pendentes</option>
            <option value={orderStatuses.PREPARING}>Preparando</option>
            <option value={orderStatuses.READY}>Prontos</option>
            <option value={orderStatuses.DELIVERED}>Entregues</option>
            <option value={orderStatuses.WAITING_PAYMENT}>Aguardando Pagamento</option>
            <option value={orderStatuses.PAID}>Pagos</option>
            <option value={orderStatuses.FINISHED}>Finalizados</option>
          </select>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Preparo</CardTitle>
            <div className="h-4 w-4 bg-orange-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === orderStatuses.PREPARING).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prontos</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === orderStatuses.READY).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finalizados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === orderStatuses.FINISHED).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold">Pedido #{order.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          Mesa {order.mesa_id} • {order.cliente_nome}
                        </p>
                      </div>
                      <Badge className={orderStatusColors[order.status]}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm">
                        <strong>Total:</strong> {formatPrice(order.valor_total)}
                        {order.taxa_servico > 0 && (
                          <span className="text-muted-foreground ml-2">
                            (Taxa: {formatPrice(order.taxa_servico)})
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.data_criacao).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Detalhes
                    </Button>
                    {getStatusActions(order)}
                  </div>
                </div>
              </Card>
            ))}
            {filteredOrders.length === 0 && (
              <div className="text-center py-8">
                <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Nenhum pedido encontrado</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders; 