// Exemplo de teste E2E Cypress para a página inicial

describe('Página inicial', () => {
  it('deve exibir o título do sistema', () => {
    cy.visit('http://localhost:5173');
    cy.contains(/comanda|dashboard|cardápio|mesa|pedido/i).should('exist');
  });
}); 