import { render, screen } from '@testing-library/react';
import Menu from '../pages/Menu';

// Mock do useMenuItems para evitar chamadas de API
jest.mock('../lib/useMenuItems', () => ({
  useMenuItems: () => ({
    items: [
      { 
        id: 1, 
        name: 'X-Burger', 
        category_id: 1, 
        is_available: true, 
        price: 10, 
        description: 'Hambúrguer delicioso', 
        image: '' 
      }
    ],
    loading: false,
    error: null,
    addItem: jest.fn(),
    editItem: jest.fn(),
    removeItem: jest.fn(),
    fetchItems: jest.fn()
  })
}));

test('renderiza itens do cardápio', () => {
  render(<Menu />);
  expect(screen.getByText('X-Burger')).toBeInTheDocument();
}); 