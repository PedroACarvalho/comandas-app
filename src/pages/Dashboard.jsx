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
  AlertCircle,
  RefreshCw
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
 * Agora integrado com API real para buscar dados em tempo real.
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar dados de pedidos
      const ordersResponse = await fetch('/api/pedidos');
      const ordersData = await ordersResponse.json();
      const orders = ordersData.pedidos || [];

      // Buscar dados de pagamentos
      const paymentsResponse = await fetch('/api/pagamentos');
      const paymentsData = await paymentsResponse.json();
      const payments = paymentsData.pagamentos || [];

      // Buscar dados de mesas
      const tablesResponse = await fetch('/api/mesas');
      const tablesData = await tablesResponse.json();
      const tables = tablesData.mesas || [];

      // Calcular estatísticas
      const totalRevenue = payments
        .filter(p => p.status === 'confirmado')
        .reduce((sum, p) => sum + parseFloat(p.valor), 0);

      const totalOrders = orders.length;
      const activeTables = tables.filter(t => t.status === 'ocupada').length;
      const pendingPayments = payments.filter(p => p.status === 'pendente').length;

      // Pedidos recentes (últimos 5)
      const recentOrders = orders
        .sort((a, b) => new Date(b.data_criacao) - new Date(a.data_criacao))
        .slice(0, 5);

      // Itens mais vendidos (mockado por enquanto - precisa implementar endpoint)
      const topItems = [
        { nome: 'X-Burger', vendas: 25, receita: 647.50 },
        { nome: 'Batata Frita', vendas: 18, receita: 286.20 },
        { nome: 'Refrigerante', vendas: 32, receita: 220.80 }
      ];

      setStats({
        totalRevenue,
        totalOrders,
        activeTables,
        pendingPayments,
        recentOrders,
        topItems
      });

    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Carregando dados...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertCircle className="w-8 h-8 text-red-600" />
        <span className="ml-2 text-red-600">{error}</span>
        <Button 
          onClick={fetchDashboardData} 
          variant="outline" 
          className="ml-4"
        >
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={fetchDashboardData}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
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
              Hoje
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
              Pedidos ativos
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
              Mesas ocupadas
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

      {/* Pedidos Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">Mesa {order.mesa_id}</p>
                      <p className="text-sm text-gray-600">{order.cliente_nome}</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.valor_total)}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.data_criacao).toLocaleTimeString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                Nenhum pedido recente
              </p>
            )}
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
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{item.nome}</p>
                    <p className="text-sm text-gray-600">{item.vendas} vendas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(item.receita)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard; 