#!/bin/bash

# Script de Deploy para Sistema de Comandas .NET
# Autor: Pedro Augusto Carvalho
# Data: $(date)

set -e

echo "🚀 Iniciando deploy do Sistema de Comandas .NET..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    error "Docker não está instalado. Instale o Docker primeiro."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose não está instalado. Instale o Docker Compose primeiro."
    exit 1
fi

# Verificar se .NET está instalado
if ! command -v dotnet &> /dev/null; then
    error ".NET não está instalado. Instale o .NET 8 primeiro."
    exit 1
fi

log "Verificando versão do .NET..."
dotnet --version

# Parar containers existentes
log "Parando containers existentes..."
docker-compose down --remove-orphans

# Limpar imagens antigas
log "Limpando imagens antigas..."
docker system prune -f

# Build das imagens
log "Construindo imagens Docker..."

# Build da API .NET
log "Construindo API .NET..."
cd ComandasApp
dotnet restore
dotnet build
cd ..

# Build do frontend
log "Construindo frontend React..."
npm install
npm run build

# Build das imagens Docker
log "Construindo imagens Docker..."
docker-compose build --no-cache

# Iniciar serviços
log "Iniciando serviços..."
docker-compose up -d

# Aguardar serviços ficarem prontos
log "Aguardando serviços ficarem prontos..."
sleep 30

# Verificar status dos serviços
log "Verificando status dos serviços..."

# Verificar API .NET
if curl -f http://localhost:5001/api/mesas > /dev/null 2>&1; then
    success "API .NET está funcionando"
else
    error "API .NET não está respondendo"
    docker-compose logs api
    exit 1
fi

# Verificar frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    success "Frontend está funcionando"
else
    error "Frontend não está respondendo"
    docker-compose logs frontend
    exit 1
fi

# Verificar Nginx
if curl -f http://localhost:80 > /dev/null 2>&1; then
    success "Nginx está funcionando"
else
    error "Nginx não está respondendo"
    docker-compose logs nginx
    exit 1
fi

# Mostrar informações finais
echo ""
success "🎉 Deploy concluído com sucesso!"
echo ""
echo "📊 Status dos serviços:"
echo "   🌐 Frontend: http://localhost:3000"
echo "   🔧 API .NET: http://localhost:5001"
echo "   📚 Swagger: http://localhost:5001/swagger"
echo "   🌍 Nginx: http://localhost:80"
echo ""
echo "📋 Comandos úteis:"
echo "   docker-compose logs -f    # Ver logs em tempo real"
echo "   docker-compose down       # Parar serviços"
echo "   docker-compose restart    # Reiniciar serviços"
echo ""

# Verificar uso de recursos
log "Verificando uso de recursos..."
docker stats --no-stream

success "Sistema de Comandas .NET está rodando perfeitamente! 🚀"
