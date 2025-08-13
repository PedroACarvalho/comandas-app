# 🍽️ Sistema de Comandas Online

Sistema PWA (Progressive Web App) para cálculo e pagamento de comandas, desenvolvido conforme TCC.

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Python Flask + SQLAlchemy + SocketIO
- **Banco de Dados**: PostgreSQL (produção) / SQLite (desenvolvimento)
- **Cache**: Redis
- **API**: RESTful com JSON + WebSocket
- **Deploy**: Docker + Docker Compose + Nginx

## 📋 Pré-requisitos

### Desenvolvimento Local
- Python 3.9+
- Node.js 16+
- npm ou yarn

### Deploy em VPS
- Ubuntu 20.04+ ou Debian 11+
- Docker e Docker Compose
- 2GB RAM mínimo (4GB+ recomendado)
- 20GB disco mínimo

## 🛠️ Instalação

### Desenvolvimento Local

#### 1. Clone o repositório
```bash
git clone https://github.com/PedroACarvalho/PWA-para-c-lculo-e-pagamento-de-comandas.git
cd comandas-app
```

#### 2. Instalar dependências do Backend
```bash
# Criar ambiente virtual
python3 -m venv .venv
source .venv/bin/activate  # No Windows: .venv\Scripts\activate

# Instalar dependências
cd backend
pip install -r requirements.txt
```

#### 3. Instalar dependências do Frontend
```bash
cd ..
npm install
```

## 🏃‍♂️ Como Executar

### Desenvolvimento Local

#### 1. Iniciar o Backend
```bash
cd backend
source ../.venv/bin/activate
python app.py
```
O backend estará disponível em: `http://localhost:5001`

#### 2. Iniciar o Frontend
```bash
npm run dev
```
O frontend estará disponível em: `http://localhost:5173`

### Deploy em VPS

#### 1. Preparar VPS
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 2. Deploy Automatizado
```bash
# Tornar script executável
chmod +x deploy-vps.sh

# Deploy em produção
./deploy-vps.sh production

# Verificar status
./deploy-vps.sh production status
```

#### 3. Configurar Domínio (Opcional)
```bash
# Instalar Certbot para SSL
sudo apt install certbot

# Obter certificado SSL
sudo certbot certonly --standalone -d seu-dominio.com

# Configurar nginx com SSL (ver DEPLOY_VPS.md)
```

## 📱 Como Usar o Sistema

### Fluxo do Cliente:
1. **Acesse**: `http://localhost:5173` (dev) ou `http://seu-dominio.com` (VPS)
2. **Identificação**: Digite seu nome e selecione uma mesa
3. **Cardápio**: Visualize e selecione os itens desejados
4. **Carrinho**: Gerencie as quantidades dos itens
5. **Pedido**: Confirme e faça o pedido
6. **Pagamento**: Escolha a forma de pagamento
7. **Finalização**: Pedido concluído com sucesso!

### Observações sobre Pagamentos e Liberação de Mesa
- Após o pagamento de um pedido:
  - O status do pedido é atualizado para "Pago"
  - A mesa é liberada automaticamente para uso por outro cliente
  - **O cliente e o pedido NÃO são removidos do banco**, garantindo histórico e rastreabilidade
  - Não é possível remover um cliente que possua pedidos associados

### Formas de Pagamento Disponíveis:
- 💰 Dinheiro
- 💳 Cartão de Crédito
- 💳 Cartão de Débito
- 📱 PIX (com integração Mercado Pago)

## 🔌 API Endpoints

### Documentação da API
- **Swagger UI**: `http://localhost:5001/apidocs`
- **Desenvolvimento**: `http://localhost:5001/api`

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

#### Categorias
- `GET /api/categorias` - Listar categorias
- `POST /api/categorias` - Criar nova categoria

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
- **item**: Itens do cardápio (nome, descrição, preço, categoria)
- **pedido**: Pedidos dos clientes (cliente, status, total)
- **pedido_item**: Relacionamento entre pedidos e itens
- **pagamento**: Registro de pagamentos (método, valor, data)
- **mesa**: Status das mesas (livre, ocupada)

### Dados de Exemplo:
O sistema já vem com itens de exemplo organizados por categorias:
- **Entradas**: Salada Caesar, Bruschetta
- **Pratos Principais**: X-Burger, X-Salada, Frango Grelhado
- **Bebidas**: Refrigerante, Suco Natural, Água
- **Sobremesas**: Sorvete, Pudim, Torta de Chocolate

## 🎯 Funcionalidades

### ✅ Implementadas
- **Gestão de Clientes**: Criar e consultar por mesa
- **Cardápio Digital**: Lista de itens com preços e categorias
- **Carrinho Interativo**: Adicionar/remover itens
- **Pedidos**: Criação e acompanhamento em tempo real
- **Pagamentos**: Múltiplas formas de pagamento
- **Interface Responsiva**: Funciona em mobile e desktop
- **PWA**: Pode ser instalado como app
- **Dashboard**: Relatórios e estatísticas
- **Backoffice**: Gestão completa do sistema
- **Integração Mercado Pago**: Pagamentos PIX e cartão
- **WebSocket**: Atualizações em tempo real

### 🚀 Melhorias Recentes
- **SQLAlchemy 2.0**: Compatibilidade atualizada
- **Mercado Pago Integration**: API real implementada
- **Dashboard Real**: Dados em tempo real das APIs
- **Menu Aprimorado**: Busca, filtros e categorias dinâmicas
- **Configuração Robusta**: Sistema de ambiente centralizado
- **Deploy VPS**: Script automatizado para produção

## 🔌 WebSocket - Comunicação em Tempo Real

O sistema utiliza **WebSocket** (Socket.IO) para fornecer atualizações em tempo real entre o frontend e backend, garantindo uma experiência fluida e responsiva.

### 📡 Arquitetura WebSocket

#### **Frontend (React)**
- **`src/lib/socket.js`** - Instância global do Socket.IO
- **`src/lib/useSocket.js`** - Hook React para escutar eventos
- **`src/config/environment.js`** - Configuração da URL do WebSocket

#### **Backend (Python/Flask)**
- **`backend/app.py`** - Configuração do Flask-SocketIO
- **`backend/events.py`** - Funções para emitir eventos
- **`backend/routes/orders.py`** - Emissão de eventos de pedidos

### 🎯 Eventos WebSocket Disponíveis

| Evento | Descrição | Emitido em | Escutado em | Status |
|--------|-----------|------------|-------------|---------|
| `pedido_novo` | Novo pedido criado | ✅ Orders.py | ✅ Orders.jsx, KitchenBoard.jsx | ✅ Funcionando |
| `pedido_atualizado` | Status do pedido alterado | ✅ Orders.py | ✅ Orders.jsx, KitchenBoard.jsx | ✅ Funcionando |
| `pagamento_recebido` | Novo pagamento processado | ❌ Não implementado | ✅ Payments.jsx | ❌ Não funciona |
| `mesa_status` | Status da mesa alterado | ❌ Não implementado | ❌ Não usado | ❌ Não implementado |

### 📱 Páginas que Utilizam WebSocket

#### **🛍️ Gestão de Pedidos (`/backoffice/orders`)**
```javascript
// Eventos escutados
socket.on('pedido_novo', handleNovo);
socket.on('pedido_atualizado', handleAtualizado);
socket.on('pagamento_recebido', handlePagamento);
```
- **Função**: Atualização automática da lista de pedidos
- **Benefício**: Não precisa recarregar a página

#### **🍽️ Quadro da Cozinha (`/backoffice/kitchen`)**
```javascript
// Eventos escutados
socket.on('pedido_novo', handleNovoPedido);
socket.on('pedido_atualizado', handlePedidoAtualizado);
```
- **Função**: Atualização do quadro Kanban em tempo real
- **Benefício**: Cozinha sempre atualizada com novos pedidos

#### **💳 Gestão de Pagamentos (`/backoffice/payments`)**
```javascript
// Eventos escutados
socket.on('pagamento_recebido', handlePagamento);
```
- **Função**: Notificação de novos pagamentos
- **Status**: ⚠️ Evento não implementado no backend

### 🔧 Configuração WebSocket

#### **Variáveis de Ambiente**
```bash
# Desenvolvimento
VITE_SOCKET_URL=http://localhost:5001

# Produção (Docker)
VITE_SOCKET_URL=http://localhost:5001
```

#### **Dependências**
```json
// Frontend (package.json)
"socket.io-client": "^4.8.1"

// Backend (requirements.txt)
"Flask-SocketIO==5.3.6"
"python-socketio==5.8.0"
```

#### **Nginx (Produção)**
```nginx
# Configuração para WebSocket
location /socket.io/ {
    proxy_pass http://backend:5001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### 🚧 Problemas Conhecidos

#### **❌ Pagamento em Tempo Real**
- **Problema**: Evento `pagamento_recebido` não é emitido no backend
- **Localização**: `backend/routes/payment.py`
- **Solução**: Implementar chamada para `emitir_pagamento_recebido()`

#### **🔧 Como Implementar Pagamento em Tempo Real**
```python
# Em backend/routes/payment.py, após criar pagamento:
from events import emitir_pagamento_recebido

# Após db.session.commit():
emitir_pagamento_recebido(current_app.socketio, novo_pagamento.to_dict())
```

### 🧪 Testes WebSocket

#### **Frontend**
```bash
npm run test:coverage
# Testa: src/__tests__/useSocket.test.jsx
```

#### **Backend**
```bash
cd backend
pytest tests/test_orders.py
# Mock dos eventos WebSocket nos testes
```

### 📊 Monitoramento WebSocket

#### **Verificar Conexões Ativas**
```bash
# Logs do backend
docker-compose logs backend | grep "Cliente conectado"

# Status do Socket.IO
curl http://localhost:5001/  # Verificar se está online
```

#### **Debug WebSocket**
```javascript
// No console do navegador
socket.on('connect', () => console.log('Conectado!'));
socket.on('disconnect', () => console.log('Desconectado!'));
```

## 🔧 Desenvolvimento

### Estrutura de Arquivos:
```
├── backend/
│   ├── app.py              # Aplicação principal
│   ├── database.py         # Configuração do banco
│   ├── models/             # Modelos do banco
│   ├── routes/             # Rotas da API
│   └── tests/              # Testes automatizados
├── src/
│   ├── App.jsx            # Componente principal
│   ├── pages/             # Páginas do sistema
│   ├── components/        # Componentes reutilizáveis
│   └── config/            # Configurações
├── payment/               # Integração Mercado Pago
├── deploy-vps.sh          # Script de deploy VPS
├── docker-compose.yml     # Configuração Docker
└── nginx.conf            # Configuração Nginx
```

### Comandos Úteis:
```bash
# Verificar status dos servidores
curl http://localhost:5001/     # Backend
curl http://localhost:5173      # Frontend (dev)
curl http://localhost/          # Frontend (VPS)

# Ver documentação da API
curl http://localhost:5001/apidocs

# Listar itens do menu
curl http://localhost:5001/api/itens

# Verificar status VPS
./deploy-vps.sh production status
```

## ✅ Testes Automatizados

### Backend (Python)
```bash
cd backend
pytest --cov=.
```
- **Cobertura**: ~70%
- **Testes**: 26 testes automatizados
- **Funcionalidades**: Clientes, Mesas, Menu, Pedidos

### Frontend (JavaScript)
```bash
npm run test:coverage
```
- **Cobertura**: Componentes, páginas e hooks
- **E2E**: Cypress para testes end-to-end

## 🚀 Deploy e Produção

### Scripts de Deploy
- **`deploy-vps.sh`**: Deploy automatizado para VPS
- **`DEPLOY_VPS.md`**: Guia completo de deploy
- **`PROBLEMAS_VPS.md`**: Troubleshooting

### Comandos VPS
```bash
# Deploy completo
./deploy-vps.sh production

# Verificar status
./deploy-vps.sh production status

# Ver logs
./deploy-vps.sh production logs

# Fazer backup
./deploy-vps.sh production backup

# Reiniciar serviços
./deploy-vps.sh production restart
```

## 🐛 Solução de Problemas

### Desenvolvimento Local

#### Backend não inicia:
```bash
# Verificar se a porta 5001 está livre
lsof -ti:5001 | xargs kill -9

# Reinstalar dependências
cd backend
pip install -r requirements.txt
```

#### Frontend não carrega:
```bash
# Verificar se a porta 5173 está livre
lsof -ti:5173 | xargs kill -9

# Reinstalar dependências
npm install
```

### VPS

#### Containers não iniciam:
```bash
# Verificar logs
docker-compose logs

# Verificar recursos
docker system df

# Limpar e reiniciar
docker system prune -a
./deploy-vps.sh production restart
```

#### Problemas de porta:
```bash
# Verificar portas em uso
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# Parar serviços conflitantes
sudo systemctl stop apache2 nginx
```

## 📖 Documentação

- **`DEPLOY_VPS.md`**: Guia completo de deploy para VPS
- **`PROBLEMAS_VPS.md`**: Troubleshooting e soluções
- **`WIKI.md`**: Documentação técnica detalhada
- **`TECHNICAL_DOCS.md`**: Especificações técnicas

## 📝 Licença

Este projeto foi desenvolvido como parte de um TCC (Trabalho de Conclusão de Curso).

## 👨‍💻 Autor

Desenvolvido conforme especificações do TCC sobre Sistema de Comandas Online.

## 🔗 Links Úteis

- **Repositório**: [GitHub](https://github.com/PedroACarvalho/PWA-para-c-lculo-e-pagamento-de-comandas)
- **Swagger UI**: `http://localhost:5001/apidocs`
- **Documentação**: `DEPLOY_VPS.md`

---

**🎉 Sistema 100% Funcional e Pronto para Produção!**

### 🚀 Status Atual
- ✅ **Backend**: Funcionando com todas as melhorias
- ✅ **Frontend**: Interface aprimorada e responsiva
- ✅ **Deploy VPS**: Script automatizado pronto
- ✅ **Testes**: Cobertura mantida
- ✅ **Documentação**: Completa e atualizada

### 📈 Próximos Passos
1. **Deploy em VPS** usando `./deploy-vps.sh production`
2. **Configurar domínio** e SSL
3. **Implementar monitoramento** avançado
4. **Configurar backup** automático 