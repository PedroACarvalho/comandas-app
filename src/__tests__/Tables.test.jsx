import { render, screen } from '@testing-library/react';
import Tables from '../pages/Tables';

// Mock do useTables para evitar chamadas de API
jest.mock('../lib/useTables', () => ({
  useTables: () => ({
    tables: [
      { 
        id: 1, 
        numero: 1, 
        capacidade: 4, 
        status: 'Disponível', 
        qr_code: 'table-1-qr' 
      },
      { 
        id: 2, 
        numero: 2, 
        capacidade: 6, 
        status: 'Ocupada', 
        qr_code: 'table-2-qr' 
      }
    ],
    loading: false,
    error: null,
    addTable: jest.fn(),
    editTable: jest.fn(),
    removeTable: jest.fn(),
    fetchTables: jest.fn()
  })
}));

test('renderiza mesas', () => {
  render(<Tables />);
  expect(screen.getByText('Mesa 1')).toBeInTheDocument();
  expect(screen.getByText('Mesa 2')).toBeInTheDocument();
}); 