import { render, screen, fireEvent } from '@testing-library/react';
import Orders from '../pages/Orders';

jest.mock('../data/mockData', () => ({
  mockOrders: [
    { id: 1, status: 'Pendente', table_id: 1, customer_name: 'João', total_amount: 10, items: [{ name: 'X-Burger', quantity: 1 }], service_fee: 0, created_at: new Date().toISOString() },
    { id: 2, status: 'Pronto', table_id: 2, customer_name: 'Maria', total_amount: 20, items: [{ name: 'Batata', quantity: 2 }], service_fee: 0, created_at: new Date().toISOString() }
  ],
  orderStatuses: { PENDING: 'Pendente', READY: 'Pronto' },
  orderStatusColors: { Pendente: 'bg-yellow-100', Pronto: 'bg-green-100' },
  formatPrice: (v) => `R$ ${v}`
}));

test('renderiza lista de pedidos e filtra por status', () => {
  render(<Orders />);
  expect(screen.getByText('João')).toBeInTheDocument();
  expect(screen.getByText('Maria')).toBeInTheDocument();
  // Filtrar por Pronto
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Pronto' } });
  expect(screen.queryByText('João')).not.toBeInTheDocument();
  expect(screen.getByText('Maria')).toBeInTheDocument();
}); 