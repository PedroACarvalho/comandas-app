import { render, screen } from '@testing-library/react';
import App from '../App';

test('renderiza o app sem crashar', () => {
  render(<App />);
  expect(screen.getByText(/comanda|dashboard|cardápio|mesa|pedido/i)).toBeInTheDocument();
}); 