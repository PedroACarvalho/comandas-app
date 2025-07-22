import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  CreditCard, 
  DollarSign, 
  Users,
  CheckCircle,
  Clock
} from 'lucide-react';
import { formatPrice, paymentMethods } from '../data/mockData';

/**
 * PaymentManagement: Tela de gestão e visualização de pagamentos do backoffice.
 * Não recebe props atualmente.
 * Sugestão: extrair lista de pagamentos para componente separado se crescer.
 */
const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Dados mockados de pagamentos
    setPayments([
      {
        id: 1,
        order_id: 1,
        customer_name: 'João Silva',
        total_amount: 45.70,
        payment_method: 'CASH',
        status: 'Aprovado',
        created_at: '2024-01-15T10:30:00Z',
        splits: []
      },
      {
        id: 2,
        order_id: 2,
        customer_name: 'Maria Santos',
        total_amount: 32.80,
        payment_method: 'CREDIT_CARD',
        status: 'Processando',
        created_at: '2024-01-15T11:15:00Z',
        splits: [
          { person_name: 'Maria', amount: 16.40, payment_method: 'CREDIT_CARD' },
          { person_name: 'Pedro', amount: 16.40, payment_method: 'PIX' }
        ]
      }
    ]);
  }, []);

  const filteredPayments = filter === 'all' 
    ? payments 
    : payments.filter(payment => payment.status.toLowerCase() === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Aprovado':
        return 'bg-green-100 text-green-800';
      case 'Processando':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pendente':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'CASH':
        return <DollarSign className="w-4 h-4" />;
      case 'CREDIT_CARD':
      case 'DEBIT_CARD':
        return <CreditCard className="w-4 h-4" />;
      case 'PIX':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Pagamentos</h1>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">Todos os Status</option>
            <option value="aprovado">Aprovados</option>
            <option value="processando">Processando</option>
            <option value="pendente">Pendentes</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pagamentos</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(payments.reduce((sum, p) => sum + p.total_amount, 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.filter(p => p.status === 'Aprovado').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processando</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.filter(p => p.status === 'Processando').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <Card key={payment.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-semibold">Pagamento #{payment.id}</h3>
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Pedido:</strong> #{payment.order_id}</p>
                        <p><strong>Cliente:</strong> {payment.customer_name}</p>
                        <p><strong>Total:</strong> {formatPrice(payment.total_amount)}</p>
                        <p><strong>Método:</strong> {paymentMethods[payment.payment_method]}</p>
                        <p><strong>Data:</strong> {new Date(payment.created_at).toLocaleString('pt-BR')}</p>
                      </div>
                      
                      {payment.splits.length > 0 && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium mb-2">Divisão de Pagamento:</p>
                          <div className="space-y-1">
                            {payment.splits.map((split, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{split.person_name}</span>
                                <span>{formatPrice(split.amount)} - {paymentMethods[split.payment_method]}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(payment.payment_method)}
                      {payment.splits.length > 0 && (
                        <Users className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentManagement; 