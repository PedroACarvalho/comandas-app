import { render, screen } from '@testing-library/react';
import Sidebar from '../components/Sidebar';
import { BrowserRouter } from 'react-router-dom';

test('renderiza links do Sidebar', () => {
  render(<BrowserRouter><Sidebar /></BrowserRouter>);
  expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  expect(screen.getByText(/Mesas/i)).toBeInTheDocument();
}); 