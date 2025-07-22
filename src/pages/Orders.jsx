import React, { useState, useEffect } from 'react';
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
import { mockOrders, orderStatuses, orderStatusColors, formatPrice } from '../data/mockData';

/**
 * Orders: Página de gestão de pedidos (filtros, ações, detalhes e estatísticas).
 * Sugestão: extrair modal de detalhes para componente separado se crescer.
 */
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    setOrders(mockOrders);
  }, []);

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
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
            Confirmar Pagamento
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Pedidos</h1>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">Todos os Status</option>
            <option value={orderStatuses.PENDING}>Pendentes</option>
            <option value={orderStatuses.ACCEPTED}>Aceitos</option>
            <option value={orderStatuses.PREPARING}>Preparando</option>
            <option value={orderStatuses.READY}>Prontos</option>
            <option value={orderStatuses.DELIVERED}>Entregues</option>
            <option value={orderStatuses.WAITING_PAYMENT}>Aguardando Pagamento</option>
            <option value={orderStatuses.PAID}>Pagos</option>
            <option value={orderStatuses.FINISHED}>Finalizados</option>
            <option value={orderStatuses.CANCELLED}>Cancelados</option>
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
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <div className="h-4 w-4 bg-yellow-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === orderStatuses.PENDING).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preparando</CardTitle>
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
      </div>

      {/* Lista de Pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-semibold">Pedido #{order.id}</h3>
                        <Badge className={orderStatusColors[order.status]}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Mesa:</strong> {order.table_id}</p>
                        <p><strong>Cliente:</strong> {order.customer_name}</p>
                        <p><strong>Total:</strong> {formatPrice(order.total_amount)}</p>
                        <p><strong>Itens:</strong> {order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Detalhes
                      </Button>
                      {getStatusActions(order)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Detalhes do Pedido #{selectedOrder.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Informações Gerais</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Mesa:</strong> {selectedOrder.table_id}</p>
                  <p><strong>Cliente:</strong> {selectedOrder.customer_name}</p>
                  <p><strong>Status:</strong> {selectedOrder.status}</p>
                  <p><strong>Data:</strong> {new Date(selectedOrder.created_at).toLocaleString('pt-BR')}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Itens do Pedido</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-medium">
                  <span>Subtotal:</span>
                  <span>{formatPrice(selectedOrder.total_amount - selectedOrder.service_fee)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Taxa de Serviço:</span>
                  <span>{formatPrice(selectedOrder.service_fee)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>{formatPrice(selectedOrder.total_amount)}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => setSelectedOrder(null)}
                >
                  Fechar
                </Button>
                {getStatusActions(selectedOrder)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Orders; 