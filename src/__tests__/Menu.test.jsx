import { render, screen } from '@testing-library/react';
import Menu from '../pages/Menu';

jest.mock('../data/mockData', () => ({
  mockCategories: [{ id: 1, name: 'Lanches' }],
  mockMenuItems: [{ id: 1, name: 'X-Burger', category_id: 1, is_available: true, price: 10, description: '', image: '' }],
  formatPrice: (v) => `R$ ${v}`
}));

test('renderiza itens do cardápio', () => {
  render(<Menu />);
  expect(screen.getByText('X-Burger')).toBeInTheDocument();
}); 