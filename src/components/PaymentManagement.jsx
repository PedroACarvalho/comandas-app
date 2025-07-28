import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  CreditCard, 
  DollarSign, 
  QrCode,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

// Métodos de pagamento
const paymentMethods = {
  CASH: 'Dinheiro',
  CREDIT_CARD: 'Cartão de Crédito',
  DEBIT_CARD: 'Cartão de Débito',
  PIX: 'PIX',
  TRANSFER: 'Transferência'
};

// Função para formatar preços
const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

/**
 * PaymentManagement: Componente de gestão de pagamentos (lista, filtros, ações).
 * Sugestão: extrair modal de detalhes para componente separado se crescer.
 */
const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Dados mockados de pagamentos
    const mockPayments = [
      {
        id: 1,
        pedido_id: 1,
        metodo: paymentMethods.CREDIT_CARD,
        valor: 45.70,
        status: 'confirmado',
        data_criacao: '2024-01-15T10:30:00Z',
        cliente_nome: 'João Silva',
        mesa_id: 2
      },
      {
        id: 2,
        pedido_id: 2,
        metodo: paymentMethods.PIX,
        valor: 32.80,
        status: 'pendente',
        data_criacao: '2024-01-15T11:15:00Z',
        cliente_nome: 'Maria Santos',
        mesa_id: 4
      },
      {
        id: 3,
        pedido_id: 3,
        metodo: paymentMethods.CASH,
        valor: 28.50,
        status: 'confirmado',
        data_criacao: '2024-01-15T12:00:00Z',
        cliente_nome: 'Carlos Oliveira',
        mesa_id: 1
      }
    ];
    setPayments(mockPayments);
  }, []);

  const filteredPayments = filter === 'all' 
    ? payments 
    : payments.filter(payment => payment.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmado':
        return <CheckCircle className="w-4 h-4" />;
      case 'pendente':
        return <Clock className="w-4 h-4" />;
      case 'cancelado':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleConfirmPayment = (paymentId) => {
    setPayments(payments.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: 'confirmado' }
        : payment
    ));
  };

  const handleCancelPayment = (paymentId) => {
    setPayments(payments.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: 'cancelado' }
        : payment
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Pagamentos</h1>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-md px-3 py-1"
          >
            <option value="all">Todos</option>
            <option value="pendente">Pendentes</option>
            <option value="confirmado">Confirmados</option>
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
            <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.filter(p => p.status === 'confirmado').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.filter(p => p.status === 'pendente').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(payments.reduce((sum, p) => sum + p.valor, 0))}
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
              <Card key={payment.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold">Pagamento #{payment.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          Mesa {payment.mesa_id} • {payment.cliente_nome}
                        </p>
                      </div>
                      <Badge className={getStatusColor(payment.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(payment.status)}
                          {payment.status}
                        </div>
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm">
                        <strong>Método:</strong> {payment.metodo}
                      </p>
                      <p className="text-sm">
                        <strong>Valor:</strong> {formatPrice(payment.valor)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.data_criacao).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {payment.status === 'pendente' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleConfirmPayment(payment.id)}
                        >
                          Confirmar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleCancelPayment(payment.id)}
                        >
                          Cancelar
                        </Button>
                      </>
                    )}
                    {payment.metodo === paymentMethods.PIX && (
                      <Button size="sm" variant="outline">
                        <QrCode className="w-4 h-4 mr-1" />
                        QR Code
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
            {filteredPayments.length === 0 && (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Nenhum pagamento encontrado</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentManagement; 