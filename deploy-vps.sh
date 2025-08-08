#!/bin/bash

# Script de deploy otimizado para VPS
# Uso: ./deploy-vps.sh [environment]
# Exemplo: ./deploy-vps.sh production

set -e

ENVIRONMENT=${1:-production}

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Verificar se o ambiente é válido
if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
    error "Ambiente inválido. Use: staging ou production"
fi

log "Iniciando deploy para VPS em ambiente: $ENVIRONMENT"

# Verificar se Docker e Docker Compose estão instalados
check_dependencies() {
    log "Verificando dependências..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker não está instalado. Instale primeiro: https://docs.docker.com/get-docker/"
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose não está instalado. Instale primeiro: https://docs.docker.com/compose/install/"
    fi
    
    log "Dependências verificadas com sucesso!"
}

# Criar arquivo .env se não existir
create_env_file() {
    log "Configurando variáveis de ambiente..."
    
    if [[ ! -f .env ]]; then
        cat > .env << EOF
# Configurações do Sistema de Comandas
ENVIRONMENT=$ENVIRONMENT

# Chaves de Segurança (ALTERE EM PRODUÇÃO!)
SECRET_KEY=$(openssl rand -hex 32)
JWT_SECRET_KEY=$(openssl rand -hex 32)

# Configurações de Banco de Dados
POSTGRES_DB=comandas
POSTGRES_USER=comandas_user
POSTGRES_PASSWORD=$(openssl rand -base64 32)

# Configurações de Redis
REDIS_PASSWORD=$(openssl rand -base64 32)

# Configurações de CORS (ajuste para seu domínio)
CORS_ORIGINS=https://seu-dominio.com,https://www.seu-dominio.com

# Configurações de Mercado Pago (opcional)
MP_ACCESS_TOKEN=your_mercadopago_access_token

# Configurações de Log
LOG_LEVEL=INFO
EOF
        log "Arquivo .env criado com sucesso!"
    else
        warn "Arquivo .env já existe. Verifique se as configurações estão corretas."
    fi
}

# Atualizar docker-compose.yml para VPS
update_docker_compose() {
    log "Atualizando docker-compose.yml para VPS..."
    
    # Backup do arquivo original
    cp docker-compose.yml docker-compose.yml.backup
    
    # Criar versão otimizada para VPS
    cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # Banco de dados PostgreSQL
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-comandas}
      POSTGRES_USER: ${POSTGRES_USER:-comandas_user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-comandas_password}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "127.0.0.1:5432:5432"
    networks:
      - comandas-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-comandas_user}"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis para cache e sessões
  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD:-}
    ports:
      - "127.0.0.1:6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - comandas-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Backend Flask
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - FLASK_ENV=${ENVIRONMENT:-production}
      - DATABASE_URL=postgresql://${POSTGRES_USER:-comandas_user}:${POSTGRES_PASSWORD:-comandas_password}@db:5432/${POSTGRES_DB:-comandas}
      - REDIS_URL=redis://:${REDIS_PASSWORD:-}@redis:6379/0
      - SECRET_KEY=${SECRET_KEY}
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
      - CORS_ORIGINS=${CORS_ORIGINS}
      - LOG_LEVEL=${LOG_LEVEL:-INFO}
      - MP_ACCESS_TOKEN=${MP_ACCESS_TOKEN:-}
    ports:
      - "127.0.0.1:5001:5001"
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./backend/logs:/app/logs
    networks:
      - comandas-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5001/"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend React (build para produção)
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    environment:
      - VITE_API_BASE_URL=http://localhost:5001
      - VITE_SOCKET_URL=http://localhost:5001
    ports:
      - "127.0.0.1:3000:80"
    depends_on:
      - backend
    networks:
      - comandas-network
    restart: unless-stopped

  # Nginx para produção (proxy reverso)
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
      - frontend
    networks:
      - comandas-network
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:

networks:
  comandas-network:
    driver: bridge
EOF

    log "docker-compose.yml atualizado para VPS!"
}

# Criar Dockerfile para frontend
create_frontend_dockerfile() {
    log "Criando Dockerfile para frontend..."
    
    cat > Dockerfile.frontend << 'EOF'
# Dockerfile para o frontend do sistema de comandas
FROM node:18-alpine as builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

# Build para produção
RUN npm run build

# Servidor de produção
FROM nginx:alpine

# Copiar arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx-frontend.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF

    log "Dockerfile.frontend criado!"
}

# Criar configuração nginx para frontend
create_nginx_frontend_config() {
    log "Criando configuração nginx para frontend..."
    
    cat > nginx-frontend.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Configurações de segurança
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # Configurações de compressão
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Roteamento para SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para arquivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

    log "nginx-frontend.conf criado!"
}

# Atualizar configuração nginx principal
update_nginx_config() {
    log "Atualizando configuração nginx principal..."
    
    # Backup do arquivo original
    cp nginx.conf nginx.conf.backup
    
    # Criar versão simplificada para VPS
    cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:5001;
    }

    upstream frontend {
        server frontend:80;
    }

    # Configurações de rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    # Configurações de segurança
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # Configurações de compressão
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Servidor HTTP (redirecionar para HTTPS se SSL estiver configurado)
    server {
        listen 80;
        server_name _;

        # Frontend (React)
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # API Backend
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            
            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # WebSocket para Socket.IO
        location /socket.io/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            
            # Configurações específicas para WebSocket
            proxy_buffering off;
            proxy_read_timeout 86400;
        }

        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # Arquivos estáticos
        location /static/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
EOF

    log "nginx.conf atualizado!"
}

# Função para deploy
deploy() {
    log "Iniciando deploy..."
    
    # Parar containers existentes
    log "Parando containers existentes..."
    docker-compose down --remove-orphans || true
    
    # Remover imagens antigas
    log "Removendo imagens antigas..."
    docker system prune -f
    
    # Build e iniciar containers
    log "Fazendo build dos containers..."
    docker-compose build --no-cache
    
    log "Iniciando containers..."
    docker-compose up -d
    
    # Aguardar serviços ficarem prontos
    log "Aguardando serviços ficarem prontos..."
    sleep 30
    
    # Verificar status
    log "Verificando status dos serviços..."
    docker-compose ps
    
    # Testar endpoints
    log "Testando endpoints..."
    sleep 10
    
    if curl -f http://localhost:5001/ > /dev/null 2>&1; then
        log "✅ Backend está funcionando!"
    else
        warn "⚠️ Backend pode não estar funcionando corretamente"
    fi
    
    if curl -f http://localhost:3000/ > /dev/null 2>&1; then
        log "✅ Frontend está funcionando!"
    else
        warn "⚠️ Frontend pode não estar funcionando corretamente"
    fi
    
    if curl -f http://localhost/ > /dev/null 2>&1; then
        log "✅ Nginx está funcionando!"
    else
        warn "⚠️ Nginx pode não estar funcionando corretamente"
    fi
    
    log "🎉 Deploy concluído com sucesso!"
    log "📊 URLs de acesso:"
    log "   - Frontend: http://localhost"
    log "   - Backend API: http://localhost:5001"
    log "   - Health Check: http://localhost/health"
}

# Função para logs
show_logs() {
    log "Mostrando logs dos containers..."
    docker-compose logs -f
}

# Função para status
show_status() {
    log "Status dos containers:"
    docker-compose ps
    
    log "Uso de recursos:"
    docker stats --no-stream
}

# Função para backup
backup() {
    log "Fazendo backup do banco de dados..."
    
    BACKUP_DIR="./backups"
    mkdir -p $BACKUP_DIR
    
    BACKUP_FILE="$BACKUP_DIR/comandas_$(date +%Y%m%d_%H%M%S).sql"
    
    docker-compose exec -T db pg_dump -U ${POSTGRES_USER:-comandas_user} ${POSTGRES_DB:-comandas} > $BACKUP_FILE
    
    log "Backup salvo em: $BACKUP_FILE"
}

# Menu principal
case ${2:-deploy} in
    deploy)
        check_dependencies
        create_env_file
        update_docker_compose
        create_frontend_dockerfile
        create_nginx_frontend_config
        update_nginx_config
        deploy
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    backup)
        backup
        ;;
    restart)
        log "Reiniciando serviços..."
        docker-compose restart
        ;;
    stop)
        log "Parando serviços..."
        docker-compose down
        ;;
    *)
        error "Ação inválida. Use: deploy, logs, status, backup, restart, stop"
        ;;
esac
