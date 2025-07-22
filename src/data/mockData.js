// Dados mockados para desenvolvimento
export const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

export const orderStatuses = {
  PENDING: 'Pendente',
  ACCEPTED: 'Aceito',
  PREPARING: 'Preparando',
  READY: 'Pronto',
  DELIVERED: 'Entregue',
  WAITING_PAYMENT: 'Aguardando_Pagamento',
  PAID: 'Pago',
  FINISHED: 'Finalizado',
  CANCELLED: 'Cancelado'
};

export const orderStatusColors = {
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

export const paymentMethods = {
  CASH: 'Dinheiro',
  CREDIT_CARD: 'Cartão de Crédito',
  DEBIT_CARD: 'Cartão de Débito',
  PIX: 'PIX',
  TRANSFER: 'Transferência'
};

// Dados mockados de exemplo
export const mockTables = [
  { id: 1, number: 1, capacity: 4, status: 'Disponível', qr_code: 'table-1-qr' },
  { id: 2, number: 2, capacity: 6, status: 'Ocupada', qr_code: 'table-2-qr' },
  { id: 3, number: 3, capacity: 4, status: 'Disponível', qr_code: 'table-3-qr' },
  { id: 4, number: 4, capacity: 8, status: 'Reservada', qr_code: 'table-4-qr' }
];

export const mockCategories = [
  { id: 1, name: 'Entradas', description: 'Pratos de entrada' },
  { id: 2, name: 'Pratos Principais', description: 'Pratos principais' },
  { id: 3, name: 'Sobremesas', description: 'Sobremesas e doces' },
  { id: 4, name: 'Bebidas', description: 'Bebidas e refrigerantes' }
];

export const mockMenuItems = [
  {
    id: 1,
    name: 'Batata Frita',
    description: 'Batatas fritas crocantes',
    price: 15.90,
    image: '/images/batata-frita.jpg',
    category_id: 1,
    is_available: true
  },
  {
    id: 2,
    name: 'X-Burger',
    description: 'Hambúrguer com queijo e salada',
    price: 25.90,
    image: '/images/x-burger.jpg',
    category_id: 2,
    is_available: true
  },
  {
    id: 3,
    name: 'Sorvete',
    description: 'Sorvete de creme',
    price: 8.90,
    image: '/images/sorvete.jpg',
    category_id: 3,
    is_available: true
  },
  {
    id: 4,
    name: 'Refrigerante',
    description: 'Refrigerante 350ml',
    price: 6.90,
    image: '/images/refrigerante.jpg',
    category_id: 4,
    is_available: true
  }
];

export const mockOrders = [
  {
    id: 1,
    table_id: 2,
    customer_name: 'João Silva',
    status: orderStatuses.PREPARING,
    total_amount: 45.70,
    service_fee: 4.57,
    created_at: '2024-01-15T10:30:00Z',
    items: [
      { name: 'X-Burger', quantity: 1, price: 25.90 },
      { name: 'Batata Frita', quantity: 1, price: 15.90 },
      { name: 'Refrigerante', quantity: 1, price: 6.90 }
    ]
  },
  {
    id: 2,
    table_id: 4,
    customer_name: 'Maria Santos',
    status: orderStatuses.READY,
    total_amount: 32.80,
    service_fee: 3.28,
    created_at: '2024-01-15T11:15:00Z',
    items: [
      { name: 'X-Burger', quantity: 1, price: 25.90 },
      { name: 'Sorvete', quantity: 1, price: 8.90 }
    ]
  }
]; 