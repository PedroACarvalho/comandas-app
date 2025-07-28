import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock do fetch para evitar erros de rede
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ 
      itens: [], 
      mesas_disponiveis: [],
      clientes: [],
      pedidos: []
    })
  })
);

test('renderiza o app sem crashar', () => {
  render(<App />);
  // Verifica se o título principal está presente
  expect(screen.getByText('Sistema de Comandas Online')).toBeInTheDocument();
}); 