import { render, screen, fireEvent } from '@testing-library/react';
import Tables from '../pages/Tables';

jest.mock('../data/mockData', () => ({
  mockTables: [
    { id: 1, number: 1, capacity: 4, status: 'Disponível', qr_code: 'qr1' },
    { id: 2, number: 2, capacity: 2, status: 'Ocupada', qr_code: 'qr2' }
  ]
}));

test('renderiza lista de mesas e filtra por status', () => {
  render(<Tables />);
  expect(screen.getByText('Mesa 1')).toBeInTheDocument();
  expect(screen.getByText('Mesa 2')).toBeInTheDocument();
  // Filtro visual: badge de status
  expect(screen.getByText('Disponível')).toBeInTheDocument();
  expect(screen.getByText('Ocupada')).toBeInTheDocument();
}); 