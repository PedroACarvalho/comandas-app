# 🍽️ Sistema de Comandas Online

Sistema completo de gestão de comandas para restaurantes e estabelecimentos alimentícios, desenvolvido com **.NET 8** e **React**.

## 🚀 **Tecnologias**

### **Backend**
- **.NET 8** - Framework principal
- **Entity Framework Core** - ORM com SQLite
- **SignalR** - WebSockets para comunicação em tempo real
- **Clean Architecture** - Arquitetura limpa e escalável
- **Swagger/OpenAPI** - Documentação automática da API

### **Frontend**
- **React 18** - Framework JavaScript
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **SignalR Client** - WebSockets no frontend

### **Infraestrutura**
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **Nginx** - Proxy reverso
- **SQLite** - Banco de dados

## 📊 **Status do Projeto**

✅ **100% MIGRADO PARA .NET**  
✅ **API .NET funcionando** perfeitamente  
✅ **Frontend integrado** com API .NET  
✅ **WebSockets** implementados  
✅ **Docker** configurado  
✅ **Pronto para produção**

## 🎯 **Funcionalidades**

### **Gestão de Mesas**
- ✅ Criar, editar e remover mesas
- ✅ Status automático (livre/ocupada)
- ✅ Capacidade configurável

### **Gestão de Clientes**
- ✅ Cadastro de clientes
- ✅ Associação automática com mesas
- ✅ Histórico de pedidos

### **Cardápio Digital**
- ✅ Categorias de produtos
- ✅ Itens com preços e descrições
- ✅ Gestão de disponibilidade

### **Pedidos**
- ✅ Criação de pedidos
- ✅ Múltiplos itens por pedido
- ✅ Status em tempo real
- ✅ Histórico completo

### **Pagamentos**
- ✅ Múltiplos métodos de pagamento
- ✅ Confirmação automática
- ✅ Liberação de mesas

### **Tempo Real**
- ✅ WebSockets com SignalR
- ✅ Notificações automáticas
- ✅ Atualizações em tempo real

## 🚀 **Como Executar**

### **Pré-requisitos**
- .NET 8 SDK
- Node.js 18+
- Docker e Docker Compose

### **Desenvolvimento Local**

#### **1. Backend .NET**
```bash
cd ComandasApp
dotnet restore
dotnet run --project src/ComandasApp.API --urls "http://localhost:5001"
```

#### **2. Frontend React**
```bash
npm install
npm run dev
```

#### **3. Acessar**
- Frontend: http://localhost:5173
- API: http://localhost:5001
- Swagger: http://localhost:5001/swagger

### **Produção com Docker**

#### **Deploy Automático**
```bash
./deploy-dotnet.sh
```

#### **Deploy Manual**
```bash
# Build e iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

## 📁 **Estrutura do Projeto**

```
comandas-app/
├── ComandasApp/                 # Backend .NET
│   ├── src/
│   │   ├── ComandasApp.API/     # API REST
│   │   ├── ComandasApp.Core/    # Entidades e Interfaces
│   │   ├── ComandasApp.Infrastructure/ # Repositórios
│   │   └── ComandasApp.Application/ # Casos de Uso
│   └── tests/                   # Testes
├── src/                         # Frontend React
│   ├── components/              # Componentes React
│   ├── pages/                   # Páginas
│   ├── hooks/                   # Hooks personalizados
│   └── config/                  # Configurações
├── docker-compose.yml           # Orquestração Docker
├── deploy-dotnet.sh            # Script de deploy
└── README.md                   # Este arquivo
```

## 🔧 **API Endpoints**

### **Mesas**
- `GET /api/mesas` - Listar mesas
- `GET /api/mesas/disponiveis` - Mesas disponíveis
- `POST /api/mesas` - Criar mesa
- `PUT /api/mesas/{id}` - Atualizar mesa
- `DELETE /api/mesas/{id}` - Remover mesa

### **Clientes**
- `GET /api/cliente/{id}` - Obter cliente
- `POST /api/cliente` - Criar cliente
- `DELETE /api/cliente/{id}` - Remover cliente

### **Itens**
- `GET /api/itens` - Listar itens
- `POST /api/itens` - Criar item
- `PUT /api/itens/{id}` - Atualizar item
- `DELETE /api/itens/{id}` - Remover item

### **Pedidos**
- `GET /api/pedidos` - Listar pedidos
- `POST /api/pedidos` - Criar pedido
- `PUT /api/pedidos/{id}/status` - Atualizar status
- `POST /api/pedidos/{id}/fechar` - Fechar pedido

### **Pagamentos**
- `POST /api/pagamentos` - Criar pagamento
- `POST /api/pagamentos/{id}/confirmar` - Confirmar pagamento

## 🧪 **Testes**

### **Backend**
```bash
cd ComandasApp
dotnet test
```

### **Frontend**
```bash
npm test
```

## 📈 **Performance**

- **5-10x mais rápido** que Python/Flask
- **Menor uso de memória**
- **Melhor escalabilidade**
- **Type Safety** com C#
- **Arquitetura limpa** e manutenível

## 🚀 **Deploy em Produção**

### **VPS com Docker**
1. Clone o repositório
2. Execute `./deploy-dotnet.sh`
3. Configure domínio no Nginx
4. Configure SSL com Let's Encrypt

### **Variáveis de Ambiente**
```bash
# API .NET
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:5001

# Frontend
VITE_API_BASE_URL=http://localhost:5001
VITE_SOCKET_URL=http://localhost:5001
```

## 📚 **Documentação**

- [Migração para .NET](dotnet-migration/RESUMO-FINAL-MIGRACAO.md)
- [Integração Frontend](FRONTEND_DOTNET_INTEGRATION.md)
- [Testes de Integração](TESTE_INTEGRACAO_RESULTADOS.md)

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 **Autor**

**Pedro Augusto Carvalho**

- GitHub: [@pedroaugustocarvalho](https://github.com/pedroaugustocarvalho)
- Email: pedroaugustocarvalho@example.com

---

**🎉 Sistema 100% migrado para .NET e pronto para produção! 🚀** 