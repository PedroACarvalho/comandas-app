import { render, screen } from '@testing-library/react';
import Menu from '../pages/Menu';

// Mock do fetch para evitar chamadas de API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: false,
    json: () => Promise.resolve({ categorias: [] })
  })
);

// Mock do useMenuItems para evitar chamadas de API
jest.mock('../lib/useMenuItems', () => ({
  useMenuItems: () => ({
    items: [
      { 
        id: 1, 
        nome: 'X-Burger', 
        categoria_id: 1, 
        disponivel: true, 
        preco: 10, 
        descricao: 'Hambúrguer delicioso', 
        imagem: '' 
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