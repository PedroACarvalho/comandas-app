import { render, screen } from '@testing-library/react';
import Orders from '../pages/Orders';

// Mock do useOrders para evitar chamadas de API
jest.mock('../lib/useOrders', () => ({
  useOrders: () => ({
    orders: [
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
          { nome: 'Batata Frita', quantidade: 1, preco: 15.90 }
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
    ],
    loading: false,
    error: null,
    updateOrderStatus: jest.fn(),
    closeOrder: jest.fn(),
    fetchOrders: jest.fn()
  })
}));

test('renderiza pedidos', () => {
  render(<Orders />);
  expect(screen.getByText('Pedido #1')).toBeInTheDocument();
  expect(screen.getByText('Pedido #2')).toBeInTheDocument();
}); 