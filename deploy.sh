#!/bin/bash

# Script de deploy para o sistema de comandas
# Uso: ./deploy.sh [environment] [action]
# Exemplo: ./deploy.sh staging deploy

set -e

ENVIRONMENT=${1:-development}
ACTION=${2:-deploy}

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Verificar se o ambiente é válido
if [[ ! "$ENVIRONMENT" =~ ^(development|staging|production)$ ]]; then
    error "Ambiente inválido. Use: development, staging ou production"
fi

# Configurações por ambiente
case $ENVIRONMENT in
    development)
        BACKEND_PORT=5001
        FRONTEND_PORT=5173
        DATABASE_URL="sqlite:///comandas.db"
        ;;
    staging)
        BACKEND_PORT=5001
        FRONTEND_PORT=5173
        DATABASE_URL="${STAGING_DATABASE_URL}"
        ;;
    production)
        BACKEND_PORT=5001
        FRONTEND_PORT=5173
        DATABASE_URL="${PRODUCTION_DATABASE_URL}"
        ;;
esac

# Função para deploy do backend
deploy_backend() {
    log "Iniciando deploy do backend para $ENVIRONMENT..."
    
    cd backend
    
    # Ativar ambiente virtual
    if [[ "$ENVIRONMENT" == "development" ]]; then
        source venv/bin/activate
    else
        # Em produção, usar Python do sistema ou container
        python3 -m venv venv
        source venv/bin/activate
    fi
    
    # Instalar dependências
    log "Instalando dependências..."
    pip install -r requirements.txt
    
    # Configurar variáveis de ambiente
    export FLASK_ENV=$ENVIRONMENT
    export DATABASE_URL=$DATABASE_URL
    export PORT=$BACKEND_PORT
    
    # Executar migrações se necessário
    if [[ "$ENVIRONMENT" != "development" ]]; then
        log "Executando migrações..."
        flask db upgrade
    fi
    
    # Inicializar banco de dados
    log "Inicializando banco de dados..."
    python init_db_script.py
    
    log "Backend configurado com sucesso!"
}

# Função para deploy do frontend
deploy_frontend() {
    log "Iniciando deploy do frontend para $ENVIRONMENT..."
    
    cd ..
    
    # Instalar dependências
    log "Instalando dependências do frontend..."
    npm install
    
    # Build para produção
    if [[ "$ENVIRONMENT" != "development" ]]; then
        log "Fazendo build para produção..."
        npm run build
    fi
    
    log "Frontend configurado com sucesso!"
}

# Função para iniciar serviços
start_services() {
    log "Iniciando serviços..."
    
    # Iniciar backend
    cd backend
    if [[ "$ENVIRONMENT" == "development" ]]; then
        source venv/bin/activate
        export FLASK_ENV=$ENVIRONMENT
        export DATABASE_URL=$DATABASE_URL
        export PORT=$BACKEND_PORT
        
        log "Iniciando backend em modo desenvolvimento..."
        python app.py &
        BACKEND_PID=$!
        echo $BACKEND_PID > backend.pid
    else
        # Em produção, usar gunicorn
        source venv/bin/activate
        export FLASK_ENV=$ENVIRONMENT
        export DATABASE_URL=$DATABASE_URL
        export PORT=$BACKEND_PORT
        
        log "Iniciando backend com gunicorn..."
        gunicorn -w 4 -b 0.0.0.0:$BACKEND_PORT --worker-class gevent --worker-connections 1000 app:app &
        BACKEND_PID=$!
        echo $BACKEND_PID > backend.pid
    fi
    
    # Iniciar frontend
    cd ..
    if [[ "$ENVIRONMENT" == "development" ]]; then
        log "Iniciando frontend em modo desenvolvimento..."
        npm run dev &
        FRONTEND_PID=$!
        echo $FRONTEND_PID > frontend.pid
    else
        # Em produção, servir arquivos estáticos
        log "Servindo arquivos estáticos..."
        npx serve -s dist -l $FRONTEND_PORT &
        FRONTEND_PID=$!
        echo $FRONTEND_PID > frontend.pid
    fi
    
    log "Serviços iniciados com sucesso!"
    log "Backend rodando em: http://localhost:$BACKEND_PORT"
    log "Frontend rodando em: http://localhost:$FRONTEND_PORT"
}

# Função para parar serviços
stop_services() {
    log "Parando serviços..."
    
    if [[ -f backend.pid ]]; then
        kill $(cat backend.pid) 2>/dev/null || true
        rm backend.pid
    fi
    
    if [[ -f frontend.pid ]]; then
        kill $(cat frontend.pid) 2>/dev/null || true
        rm frontend.pid
    fi
    
    log "Serviços parados!"
}

# Função para verificar status
check_status() {
    log "Verificando status dos serviços..."
    
    if [[ -f backend.pid ]]; then
        BACKEND_PID=$(cat backend.pid)
        if ps -p $BACKEND_PID > /dev/null; then
            log "Backend está rodando (PID: $BACKEND_PID)"
        else
            warn "Backend não está rodando"
        fi
    else
        warn "Backend não está rodando"
    fi
    
    if [[ -f frontend.pid ]]; then
        FRONTEND_PID=$(cat frontend.pid)
        if ps -p $FRONTEND_PID > /dev/null; then
            log "Frontend está rodando (PID: $FRONTEND_PID)"
        else
            warn "Frontend não está rodando"
        fi
    else
        warn "Frontend não está rodando"
    fi
}

# Função para logs
show_logs() {
    log "Mostrando logs..."
    
    if [[ -f backend/logs/comandas.log ]]; then
        echo "=== Backend Logs ==="
        tail -f backend/logs/comandas.log
    else
        warn "Arquivo de log do backend não encontrado"
    fi
}

# Menu principal
case $ACTION in
    deploy)
        deploy_backend
        deploy_frontend
        log "Deploy concluído com sucesso!"
        ;;
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        stop_services
        sleep 2
        start_services
        ;;
    status)
        check_status
        ;;
    logs)
        show_logs
        ;;
    *)
        error "Ação inválida. Use: deploy, start, stop, restart, status, logs"
        ;;
esac 