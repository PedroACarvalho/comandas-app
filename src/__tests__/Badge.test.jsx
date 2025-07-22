import { render, screen } from '@testing-library/react';
import { Badge } from '../components/ui/badge';

test('renderiza Badge padrão', () => {
  render(<Badge>Ativo</Badge>);
  expect(screen.getByText('Ativo')).toBeInTheDocument();
});

test('aplica variante destructive', () => {
  render(<Badge variant="destructive">Erro</Badge>);
  expect(screen.getByText('Erro')).toHaveClass('bg-destructive');
}); 