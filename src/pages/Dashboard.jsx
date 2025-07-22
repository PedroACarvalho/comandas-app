import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Clock,
  DollarSign,
  Package
} from 'lucide-react';
import { formatPrice } from '../data/mockData';

/**
 * Dashboard: Página inicial com cards de estatísticas, gráficos e tabelas de resumo.
 */
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    activeTables: 0,
    totalTables: 0
  });

  useEffect(() => {
    // Simular carregamento de dados
    setStats({
      totalOrders: 156,
      pendingOrders: 8,
      totalRevenue: 12580.50,
      averageOrderValue: 80.65,
      activeTables: 12,
      totalTables: 20
    });
  }, []);

  const statCards = [
    {
      title: 'Pedidos Hoje',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pedidos Pendentes',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Receita Total',
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Ticket Médio',
      value: formatPrice(stats.averageOrderValue),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Mesas Ativas',
      value: `${stats.activeTables}/${stats.totalTables}`,
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Produtos Vendidos',
      value: '342',
      icon: Package,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button>Ver Relatório Completo</Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos e Tabelas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Mesa 3 - João Silva</p>
                  <p className="text-sm text-gray-500">X-Burger, Batata Frita</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(45.70)}</p>
                  <p className="text-sm text-orange-600">Preparando</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Mesa 7 - Maria Santos</p>
                  <p className="text-sm text-gray-500">Sorvete, Refrigerante</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(15.80)}</p>
                  <p className="text-sm text-green-600">Pronto</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">X-Burger</span>
                <span className="text-sm text-gray-500">45 vendas</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Batata Frita</span>
                <span className="text-sm text-gray-500">38 vendas</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Refrigerante</span>
                <span className="text-sm text-gray-500">32 vendas</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sorvete</span>
                <span className="text-sm text-gray-500">28 vendas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 