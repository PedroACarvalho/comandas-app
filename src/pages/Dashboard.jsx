import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Badge } from '../components/ui/badge';

// Função para formatar preços
const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

/**
 * Dashboard: Página principal do backoffice com estatísticas e visão geral.
 * Sugestão: extrair cards de estatísticas para componentes separados se crescer.
 */
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeTables: 0,
    pendingPayments: 0,
    recentOrders: [],
    topItems: []
  });

  useEffect(() => {
    // TODO: Integrar com API real
    // Por enquanto, dados mockados
    setStats({
      totalRevenue: 1250.80,
      totalOrders: 45,
      activeTables: 8,
      pendingPayments: 3,
      recentOrders: [
        { id: 1, mesa: 2, cliente: 'João Silva', valor: 45.70, status: 'preparando' },
        { id: 2, mesa: 4, cliente: 'Maria Santos', valor: 32.80, status: 'pronto' },
        { id: 3, mesa: 1, cliente: 'Carlos Oliveira', valor: 28.50, status: 'entregue' }
      ],
      topItems: [
        { nome: 'X-Burger', vendas: 25, receita: 647.50 },
        { nome: 'Batata Frita', vendas: 18, receita: 286.20 },
        { nome: 'Refrigerante', vendas: 32, receita: 220.80 }
      ]
    });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparando':
        return 'bg-orange-100 text-orange-800';
      case 'pronto':
        return 'bg-green-100 text-green-800';
      case 'entregue':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button>Ver Relatório Completo</Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +12 pedidos hoje
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mesas Ativas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTables}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeTables}/12 mesas ocupadas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPayments}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando confirmação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e Listas */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Pedidos Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Pedido #{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      Mesa {order.mesa} • {order.cliente}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.valor)}</p>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Itens Mais Vendidos */}
        <Card>
          <CardHeader>
            <CardTitle>Itens Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.vendas} vendas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(item.receita)}</p>
                    <p className="text-sm text-muted-foreground">
                      {((item.receita / stats.totalRevenue) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 