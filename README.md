# 🍽️ Comandas App

Sistema PWA (Progressive Web App) para cálculo e pagamento de comandas, desenvolvido conforme TCC.

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Python Flask + SQLAlchemy
- **Banco de Dados**: SQLite
- **API**: RESTful com JSON

## 📋 Pré-requisitos

- Python 3.9+
- Node.js 16+
- npm ou yarn

## 🛠️ Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd comandas-app
```

### 2. Instalar dependências do Backend
```bash
# Criar ambiente virtual (opcional)
python3 -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt
```

### 3. Instalar dependências do Frontend
```bash
npm install
```

## 🏃‍♂️ Como Executar

### 1. Iniciar o Backend
```bash
python3 backend/app.py
```
O backend estará disponível em: `http://localhost:5001`

### 2. Iniciar o Frontend
```bash
npm run dev
```
O frontend estará disponível em: `http://localhost:5173`

## 📱 Como Usar o Sistema

### Fluxo do Cliente:
1. **Acesse**: `http://localhost:5173`
2. **Identificação**: Digite seu nome e selecione uma mesa
3. **Cardápio**: Visualize e selecione os itens desejados
4. **Carrinho**: Gerencie as quantidades dos itens
5. **Pedido**: Confirme e faça o pedido
6. **Pagamento**: Escolha a forma de pagamento
7. **Finalização**: Pedido concluído com sucesso! A mesa é liberada para novos clientes, mas o histórico do pedido e do cliente é mantido no sistema.

### Observações sobre Pagamentos e Liberação de Mesa
- Após o pagamento de um pedido:
  - O status do pedido é atualizado para "Pago".
  - A mesa é liberada automaticamente para uso por outro cliente.
  - **O cliente e o pedido NÃO são removidos do banco**, garantindo histórico e rastreabilidade.
  - Não é possível remover um cliente que possua pedidos associados.
- O sistema impede pagamentos duplicados e só permite pagamento de pedidos fechados.

### Formas de Pagamento Disponíveis:
- 💰 Dinheiro
- 💳 Cartão de Crédito
- 💳 Cartão de Débito
- 📱 PIX

## 🔌 API Endpoints

### Documentação da API
Acesse: `http://localhost:5001/api`

### Endpoints Principais:

#### Clientes
- `POST /api/cliente` - Criar novo cliente
- `GET /api/cliente/<mesa>` - Obter cliente por mesa
- `DELETE /api/cliente/<id>` - Remover cliente

#### Itens do Menu
- `GET /api/itens` - Listar todos os itens
- `POST /api/itens` - Criar novo item
- `GET /api/itens/<id>` - Obter item por ID
- `PUT /api/itens/<id>` - Atualizar item
- `DELETE /api/itens/<id>` - Remover item

#### Pedidos
- `POST /api/pedidos` - Criar novo pedido
- `GET /api/pedidos/<id>` - Obter pedido por ID
- `PUT /api/pedidos/<id>/status` - Atualizar status do pedido
- `GET /api/pedidos/cliente/<id>` - Obter pedidos de um cliente

#### Pagamentos
- `POST /api/pagamentos` - Criar novo pagamento
- `GET /api/pagamentos/<id>` - Obter pagamento por ID
- `GET /api/pagamentos/pedido/<id>` - Obter pagamento por pedido

## 📊 Exemplos de Uso da API

### Criar Cliente
```bash
curl -X POST http://localhost:5001/api/cliente \
  -H "Content-Type: application/json" \
  -d '{"nome": "João Silva", "mesa": 1}'
```

### Criar Pedido
```bash
curl -X POST http://localhost:5001/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "cliente_id": 1,
    "itens": [
      {"item_id": 1, "quantidade": 2},
      {"item_id": 3, "quantidade": 1}
    ]
  }'
```

### Fazer Pagamento
```bash
curl -X POST http://localhost:5001/api/pagamentos \
  -H "Content-Type: application/json" \
  -d '{
    "pedido_id": 1,
    "metodo": "Cartão de Crédito",
    "valor": 38.30
  }'
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas:
- **cliente**: Informações do cliente (nome, mesa)
- **item**: Itens do cardápio (nome, descrição, preço)
- **pedido**: Pedidos dos clientes (cliente, status, total)
- **pedido_item**: Relacionamento entre pedidos e itens
- **pagamento**: Registro de pagamentos (método, valor, data)

### Dados de Exemplo:
O sistema já vem com 5 itens de exemplo:
- X-Burger (R$ 15,90)
- X-Salada (R$ 17,90)
- Refrigerante (R$ 6,50)
- Batata Frita (R$ 12,90)
- Sorvete (R$ 8,50)

## 🎯 Funcionalidades

- ✅ **Gestão de Clientes**: Criar e consultar por mesa
- ✅ **Cardápio Digital**: Lista de itens com preços
- ✅ **Carrinho Interativo**: Adicionar/remover itens
- ✅ **Pedidos**: Criação e acompanhamento
- ✅ **Pagamentos**: Múltiplas formas de pagamento
- ✅ **Interface Responsiva**: Funciona em mobile e desktop
- ✅ **PWA**: Pode ser instalado como app

## 🔧 Desenvolvimento

### Estrutura de Arquivos:
```
├── backend/
│   ├── app.py              # Aplicação principal
│   ├── database.py         # Configuração do banco
│   ├── models/             # Modelos do banco
│   └── routes/             # Rotas da API
├── src/
│   ├── App.jsx            # Componente principal
│   ├── dataService.js     # Serviços de API
│   └── App.css            # Estilos
├── package.json
└── requirements.txt
```

### Comandos Úteis:
```bash
# Verificar status dos servidores
curl http://localhost:5001/     # Backend
curl http://localhost:5173      # Frontend

# Ver documentação da API
curl http://localhost:5001/api

# Listar itens do menu
curl http://localhost:5001/api/itens
```

## ✅ Testes Automatizados (Backend)

O projeto possui **testes automatizados** para garantir a qualidade e a confiabilidade das principais rotas da API.

### Como rodar os testes
```bash
# (No ambiente virtual Python)
pytest --cov=.
```
- O comando acima executa todos os testes e mostra o relatório de cobertura.

### Estrutura dos testes
Os testes estão localizados em `backend/tests/` e cobrem os seguintes fluxos:

- **Clientes:**
  - `POST /api/cliente` (criação)
  - `GET /api/cliente/<mesa>` (consulta)
  - `DELETE /api/cliente/<id>` (remoção)
  - `GET /api/mesas/disponiveis` (mesas livres)
- **Mesas:**
  - `GET /api/mesas`, `POST /api/mesas`, `PUT /api/mesas/<id>`, `DELETE /api/mesas/<id>`
- **Itens/Menu:**
  - `GET /api/itens`, `POST /api/itens`, `PUT /api/itens/<id>`, `DELETE /api/itens/<id>`
- **Pedidos:**
  - `POST /api/pedidos`, `GET /api/pedidos`, `GET /api/pedidos/<id>`, `PUT /api/pedidos/<id>/status`
  - `GET /api/pedidos/cliente/<id>`, `GET /api/pedidos/cliente/<id>/ativo`, `POST /api/pedidos/<id>/fechar`

### Boas práticas adotadas nos testes
- **Isolamento total:** O banco de dados é limpo antes de cada teste, garantindo que não haja interferência entre eles.
- **Cobertura de fluxos de sucesso e erro:** Todos os endpoints principais são testados para casos de sucesso e falha (ex: dados inválidos, recursos inexistentes).
- **Mock de WebSocket:** Funções de emissão de eventos via WebSocket são mockadas nos testes para evitar dependências externas.
- **Cobertura:** Atualmente, a cobertura dos testes do backend está em torno de **70%** e pode ser expandida para pagamentos e outros fluxos.

### Exemplo de saída dos testes
```bash
$ pytest --cov=.
=========================================== test session starts ============================================
collected 26 items

backend/tests/test_auth.py .....
backend/tests/test_menu.py .....
backend/tests/test_orders.py .........
backend/tests/test_routes.py .
backend/tests/test_tables.py ......

============================================== tests coverage ==============================================
Name                            Stmts   Miss  Cover
---------------------------------------------------
backend/routes/auth.py             68     10    85%
backend/routes/menu.py             65     15    77%
backend/routes/orders.py          120     26    78%
backend/routes/tables.py           53      2    96%
backend/tests/test_auth.py         27      0   100%
backend/tests/test_menu.py         30      0   100%
backend/tests/test_orders.py       91      0   100%
backend/tests/test_tables.py       35      0   100%
...
TOTAL                             856    253    70%
===================================== 26 passed, 29 warnings in 1.12s ======================================
```

### Como contribuir com testes
- Adicione novos testes para cada novo endpoint ou fluxo implementado.
- Garanta que todos os testes passem antes de submeter um PR.
- Mantenha a cobertura sempre acima de 70%.

## ✅ Testes Automatizados (Frontend)

O frontend possui testes automatizados de dois tipos:
- **Testes unitários e de integração** (Jest + React Testing Library)
- **Testes end-to-end (E2E)** (Cypress)

### Como rodar os testes unitários
```bash
npm run test:coverage
```
- Executa todos os testes unitários e mostra o relatório de cobertura.

### Estrutura dos testes unitários
Os testes ficam em `src/__tests__/` e cobrem:
- Componentes de UI (`Button`, `Badge`, `Sidebar`, `Notification`...)
- Páginas principais (`Orders`, `Tables`, `Menu`...)
- Hooks customizados (`useApi`, `useLoading`, `useSocket`)

#### Exemplo de teste de componente
```js
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renderiza o app sem crashar', () => {
  render(<App />);
  expect(screen.getByText(/comanda|dashboard|cardápio|mesa|pedido/i)).toBeInTheDocument();
});
```

#### Exemplo de teste de página
```js
import { render, screen, fireEvent } from '@testing-library/react';
import Orders from '../pages/Orders';

test('renderiza lista de pedidos e filtra por status', () => {
  render(<Orders />);
  expect(screen.getByText('João')).toBeInTheDocument();
  expect(screen.getByText('Maria')).toBeInTheDocument();
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Pronto' } });
  expect(screen.queryByText('João')).not.toBeInTheDocument();
  expect(screen.getByText('Maria')).toBeInTheDocument();
});
```

### Como rodar testes E2E (Cypress)
```bash
npx cypress open
# ou
npx cypress run
```
- Os testes E2E ficam em `cypress/e2e/` e simulam o uso real do sistema no navegador.

#### Exemplo de teste E2E
```js
// cypress/e2e/home.cy.js
describe('Página inicial', () => {
  it('deve exibir o título do sistema', () => {
    cy.visit('http://localhost:5173');
    cy.contains(/comanda|dashboard|cardápio|mesa|pedido/i).should('exist');
  });
});
```

### Boas práticas adotadas nos testes do frontend
- **Cobertura de componentes, hooks e páginas**.
- **Mocks de dados e dependências** para isolar o teste do backend.
- **Testes E2E para fluxos críticos** (login, navegação, pedidos, etc).
- **Cobertura**: mantenha sempre acima de 70% para garantir confiança nas mudanças.

### Como contribuir com testes
- Adicione testes para cada novo componente, hook ou página criada.
- Garanta que todos os testes passem antes de submeter um PR.
- Use mocks para dependências externas e dados dinâmicos.

## 🐛 Solução de Problemas

### Backend não inicia:
```bash
# Verificar se a porta 5001 está livre
lsof -ti:5001 | xargs kill -9

# Reinstalar dependências
pip install -r requirements.txt
```

### Frontend não carrega:
```bash
# Verificar se a porta 5173 está livre
lsof -ti:5173 | xargs kill -9

# Reinstalar dependências
npm install
```

### Erro de CORS:
- O backend já está configurado com CORS habilitado
- Se persistir, verifique se ambos os servidores estão rodando

## 📝 Licença

Este projeto foi desenvolvido como parte de um TCC (Trabalho de Conclusão de Curso).

## 👨‍💻 Autor

Desenvolvido conforme especificações do TCC sobre Sistema de Comandas Online.

---

**🎉 Sistema 100% Funcional e Pronto para Uso!** 

## 🧹 Boas Práticas de Código (Clean Code)

Para contribuir com o projeto, siga as seguintes recomendações:

- **Nomes claros e descritivos** para funções, variáveis e arquivos.
- **Funções pequenas e com responsabilidade única**.
- **Evite duplicação de código**: extraia funções utilitárias sempre que possível.
- **Padronize status, mensagens e constantes** em variáveis ou enums.
- **Adicione docstrings e comentários** explicativos em funções, classes e métodos complexos.
- **Organize o código em módulos/coerentes** (rotas, modelos, serviços, etc.).
- **Tratamento de erros consistente**: use try/except e mensagens claras para o usuário.
- **Mantenha a documentação e exemplos de uso sempre atualizados** conforme a API evoluir.

> **Dica:** Antes de submeter um PR, revise se endpoints, exemplos de uso e instruções no README refletem o estado atual da API. 

## 📖 Documentação Interativa da API (Swagger)

A API possui documentação interativa via **Swagger UI** (OpenAPI), facilitando a exploração, teste e integração dos endpoints.

### Como acessar
- Inicie o backend normalmente.
- Acesse no navegador: [http://localhost:5001/apidocs](http://localhost:5001/apidocs)

### O que você pode fazer no Swagger UI:
- Visualizar todos os endpoints disponíveis, agrupados por categoria (Clientes, Mesas, Itens, Pedidos, Pagamentos).
- Ver exemplos de requisições e respostas para cada rota.
- Testar endpoints diretamente pelo navegador (enviando payloads e vendo respostas reais).
- Conferir descrições, parâmetros obrigatórios, tipos de dados e mensagens de erro.

### Exemplo de uso
1. Abra o link acima no navegador.
2. Expanda a seção desejada (ex: `POST /api/pedidos`).
3. Clique em "Try it out" para editar e enviar uma requisição real.
4. Veja a resposta da API em tempo real, incluindo status, headers e body.

> **Dica:** Use o Swagger UI para validar integrações, testar rapidamente e entender o funcionamento da API sem precisar de ferramentas externas. 

## ☁️ Versionamento no GitHub

Este projeto está versionado e salvo remotamente no GitHub:

- **Repositório:** [https://github.com/PedroACarvalho/PWA-para-c-lculo-e-pagamento-de-comandas](https://github.com/PedroACarvalho/PWA-para-c-lculo-e-pagamento-de-comandas)

### Como salvar alterações no repositório remoto

Sempre que fizer alterações no código e quiser salvar no GitHub, utilize os comandos abaixo no terminal, dentro da pasta do projeto:

```bash
git add .
git commit -m "sua mensagem de commit aqui"
git push
```

Esses comandos vão:
- Adicionar todas as alterações para serem versionadas (`git add .`)
- Criar um commit com uma mensagem descritiva (`git commit -m ...`)
- Enviar as alterações para o repositório remoto no GitHub (`git push`)

Se for o primeiro clone em outra máquina, basta rodar:
```bash
git clone https://github.com/PedroACarvalho/PWA-para-c-lculo-e-pagamento-de-comandas.git
```

Assim, todo o histórico e código do projeto estará sempre salvo e disponível na nuvem! 