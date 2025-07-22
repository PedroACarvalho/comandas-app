import { render, screen } from '@testing-library/react';
import { Button } from '../components/ui/button';

describe('Button', () => {
  it('renderiza botão com texto', () => {
    render(<Button>Salvar</Button>);
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });
}); 