# 🚀 Migração para .NET - Sistema de Comandas Online

## 📋 Objetivo
Migrar o backend do sistema de comandas de Python/Flask para .NET 8, mantendo todas as funcionalidades existentes e melhorando a performance.

## 🏗️ Estrutura Atual (Python/Flask)
```
backend/
├── app.py                 # Aplicação Flask
├── config.py              # Configurações
├── database.py            # Configuração do banco
├── models/                # Modelos SQLAlchemy
│   ├── cliente.py
│   ├── mesa.py
│   ├── pedido.py
│   ├── item.py
│   └── pagamento.py
├── routes/                # Rotas da API
│   ├── auth.py
│   ├── orders.py
│   ├── payment.py
│   ├── menu.py
│   └── tables.py
└── requirements.txt
```

## 🎯 Nova Estrutura (.NET 8)
```
ComandasApp/
├── src/
│   ├── ComandasApp.API/           # Web API (.NET 8)
│   │   ├── Controllers/
│   │   ├── Program.cs
│   │   └── appsettings.json
│   ├── ComandasApp.Core/          # Entidades e interfaces
│   │   ├── Entities/
│   │   ├── Interfaces/
│   │   └── DTOs/
│   ├── ComandasApp.Infrastructure/ # EF Core, Repositories
│   │   ├── Data/
│   │   ├── Repositories/
│   │   └── Services/
│   └── ComandasApp.Application/    # Services, DTOs
│       ├── Services/
│       ├── DTOs/
│       └── Mappers/
├── tests/
│   ├── ComandasApp.API.Tests/
│   └── ComandasApp.Application.Tests/
└── docker/
    ├── Dockerfile
    └── docker-compose.yml
```

## 🔄 Funcionalidades a Migrar

### ✅ API Endpoints
- [x] `POST /api/cliente` - Criar cliente
- [x] `GET /api/mesas/disponiveis` - Listar mesas disponíveis
- [x] `POST /api/pedidos` - Criar pedido
- [x] `GET /api/pedidos` - Listar pedidos
- [x] `PUT /api/pedidos/{id}/status` - Atualizar status
- [ ] `POST /api/pagamentos` - Criar pagamento
- [x] `GET /api/itens` - Listar itens do menu
- [ ] `GET /api/categorias` - Listar categorias

### ✅ WebSockets (SignalR)
- [ ] `pedido_novo` - Novo pedido criado
- [ ] `pedido_atualizado` - Status do pedido atualizado
- [ ] `mesa_atualizada` - Status da mesa atualizado

### ✅ Funcionalidades Especiais
- [ ] Quadro da Cozinha (Kanban)
- [ ] Confirmação de pagamento em dinheiro
- [ ] Criação de novo pedido ao "Pedir mais itens"
- [ ] Integração com Mercado Pago

## 🛠️ Tecnologias .NET

### Core
- **.NET 8** - Framework principal
- **Entity Framework Core** - ORM
- **SignalR** - WebSockets
- **AutoMapper** - Mapeamento de objetos

### API
- **ASP.NET Core Web API** - Framework da API
- **Swagger/OpenAPI** - Documentação
- **FluentValidation** - Validação
- **Serilog** - Logging estruturado

### Testes
- **xUnit** - Framework de testes
- **Moq** - Mocking
- **FluentAssertions** - Assertions

### Deploy
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **Nginx** - Reverse proxy

## 📊 Comparação de Performance

| Aspecto | Python/Flask | .NET 8 |
|---------|-------------|---------|
| **Requests/sec** | ~2,000 | ~15,000 |
| **Memory Usage** | Alto | Baixo |
| **Startup Time** | Lento | Rápido |
| **WebSockets** | Flask-SocketIO | SignalR (nativo) |
| **ORM** | SQLAlchemy | EF Core |
| **Validation** | Manual | FluentValidation |

## 🚀 Benefícios da Migração

### Performance
- **5-10x mais rápido** para APIs REST
- **Menor uso de memória**
- **Startup mais rápido**

### Desenvolvimento
- **Hot Reload** nativo
- **IntelliSense** superior
- **Debugging** mais poderoso

### Manutenibilidade
- **Type Safety** forte
- **Dependency Injection** nativo
- **Logging estruturado**

### Deploy
- **Containers otimizados**
- **Deploy nativo** no Azure
- **CI/CD** mais simples

## 📅 Cronograma

### Semana 1: Setup e Estrutura ✅
- [x] Criar projeto .NET
- [x] Configurar Entity Framework
- [x] Migrar entidades básicas
- [x] Setup de testes

### Semana 2: API Básica ✅
- [x] Migrar controllers principais
- [x] Implementar repositories
- [x] Configurar AutoMapper
- [x] Validações com FluentValidation

### Semana 3: WebSockets e Tempo Real
- [ ] Implementar SignalR
- [ ] Migrar funcionalidades de tempo real
- [ ] Quadro da cozinha
- [ ] Notificações

### Semana 4: Funcionalidades Especiais
- [ ] Integração Mercado Pago
- [ ] Confirmação de pagamentos
- [ ] Novos pedidos
- [ ] Testes completos

### Semana 5: Deploy e Otimização
- [ ] Docker setup
- [ ] Deploy em produção
- [ ] Performance tuning
- [ ] Documentação

## 🔧 Comandos Úteis

### Criar Projeto
```bash
dotnet new sln -n ComandasApp
dotnet new webapi -n ComandasApp.API
dotnet new classlib -n ComandasApp.Core
dotnet new classlib -n ComandasApp.Infrastructure
dotnet new classlib -n ComandasApp.Application
```

### Adicionar ao Solution
```bash
dotnet sln add src/ComandasApp.API/ComandasApp.API.csproj
dotnet sln add src/ComandasApp.Core/ComandasApp.Core.csproj
dotnet sln add src/ComandasApp.Infrastructure/ComandasApp.Infrastructure.csproj
dotnet sln add src/ComandasApp.Application/ComandasApp.Application.csproj
```

### Executar
```bash
dotnet run --project src/ComandasApp.API
```

### Testes
```bash
dotnet test
```

## 📝 Notas Importantes

### Banco de Dados
- Manter SQLite para desenvolvimento
- Considerar PostgreSQL para produção
- Migrations automáticas com EF Core

### Frontend
- Manter React/Vite inalterado
- Apenas atualizar URLs da API se necessário
- WebSockets funcionarão com SignalR

### Deploy
- Docker Compose atualizado
- Nginx configurado para .NET
- Variáveis de ambiente adaptadas

## 🎯 Próximos Passos

1. ✅ Backup do projeto atual (FEITO)
2. ✅ Criar estrutura .NET (FEITO)
3. ✅ Migrar entidades (FEITO)
4. ✅ Implementar API básica (FEITO)
5. 🔄 WebSockets com SignalR
6. 🔄 Funcionalidades especiais
7. 🔄 Deploy e testes

---

**Status**: 🟡 Em Andamento  
**Última Atualização**: $(date)  
**Responsável**: Pedro Augusto Carvalho
