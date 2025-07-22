import { render, screen } from '@testing-library/react';
import { Notification } from '../components/ui/Notification';

test('exibe mensagem de sucesso', () => {
  render(<Notification message="Sucesso!" type="success" />);
  expect(screen.getByText('Sucesso!')).toBeInTheDocument();
  expect(screen.getByText('Sucesso!').className).toMatch(/bg-green-500/);
});

test('exibe mensagem de erro', () => {
  render(<Notification message="Erro!" type="error" />);
  expect(screen.getByText('Erro!')).toBeInTheDocument();
  expect(screen.getByText('Erro!').className).toMatch(/bg-red-500/);
}); 