# 🚀 Guia de Deploy - Sistema de Comandas

Este documento explica como fazer deploy do sistema de comandas em diferentes ambientes.

## 📋 Índice

1. [Ambientes Disponíveis](#ambientes-disponíveis)
2. [Deploy Local (Desenvolvimento)](#deploy-local)
3. [Deploy em Homologação (Staging)](#deploy-staging)
4. [Deploy em Produção](#deploy-producao)
5. [Monitoramento e Logs](#monitoramento)
6. [Backup e Recuperação](#backup)
7. [Troubleshooting](#troubleshooting)

## 🌍 Ambientes Disponíveis

### Desenvolvimento (Development)
- **Propósito**: Desenvolvimento local
- **URL**: `http://localhost:5173`
- **API**: `http://localhost:5001`
- **Banco**: SQLite local
- **Debug**: Ativado

### Homologação (Staging)
- **Propósito**: Testes antes da produção
- **URL**: `https://staging.comandas.com`
- **API**: `https://api-staging.comandas.com`
- **Banco**: PostgreSQL
- **Debug**: Desativado

### Produção (Production)
- **Propósito**: Ambiente final dos usuários
- **URL**: `https://comandas.com`
- **API**: `https://api.comandas.com`
- **Banco**: PostgreSQL
- **Debug**: Desativado

## 🛠️ Deploy Local

### Pré-requisitos
- Python 3.9+
- Node.js 18+
- npm ou yarn

### Passos

1. **Clone o repositório**
```bash
git clone <repository-url>
cd comandas-app
```

2. **Execute o script de deploy**
```bash
./deploy.sh development deploy
```

3. **Inicie os serviços**
```bash
./deploy.sh development start
```

4. **Verifique o status**
```bash
./deploy.sh development status
```

### Acessos
- Frontend: http://localhost:5173
- Backend: http://localhost:5001
- API Docs: http://localhost:5001/api

## 🧪 Deploy em Homologação

### Pré-requisitos
- Servidor Linux (Ubuntu 20.04+)
- Docker e Docker Compose
- Domínio configurado (staging.comandas.com)

### Configuração do Servidor

1. **Instalar Docker**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

2. **Instalar Docker Compose**
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

3. **Configurar variáveis de ambiente**
```bash
# Criar arquivo .env
cat > .env << EOF
SECRET_KEY=your-super-secret-key-for-staging
JWT_SECRET_KEY=your-jwt-secret-key-for-staging
DATABASE_URL=postgresql://comandas_user:comandas_password@db:5432/comandas
REDIS_URL=redis://redis:6379/0
CORS_ORIGINS=https://staging.comandas.com
EOF
```

4. **Deploy com Docker Compose**
```bash
# Deploy completo
docker-compose up -d

# Verificar logs
docker-compose logs -f

# Verificar status
docker-compose ps
```

### Configuração de DNS
Configure o DNS para apontar `staging.comandas.com` para o IP do servidor.

## 🏭 Deploy em Produção

### Arquitetura Recomendada

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   CDN (CloudFlare) │    │   SSL Certificate │
│   (Nginx/HAProxy) │    │                 │    │   (Let's Encrypt) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Server    │    │   Application   │    │   Database      │
│   (Nginx)       │    │   (Flask)       │    │   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static Files  │    │   Cache         │    │   Backup        │
│   (React)       │    │   (Redis)       │    │   (Automated)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Passos de Deploy

1. **Preparar servidor de produção**
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências
sudo apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx

# Configurar firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

2. **Configurar SSL com Let's Encrypt**
```bash
# Obter certificado SSL
sudo certbot --nginx -d comandas.com -d www.comandas.com

# Configurar renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

3. **Deploy da aplicação**
```bash
# Clonar repositório
git clone <repository-url>
cd comandas-app

# Configurar variáveis de produção
cat > .env << EOF
SECRET_KEY=$(openssl rand -hex 32)
JWT_SECRET_KEY=$(openssl rand -hex 32)
DATABASE_URL=postgresql://comandas_user:comandas_password@db:5432/comandas
REDIS_URL=redis://redis:6379/0
CORS_ORIGINS=https://comandas.com,https://www.comandas.com
FLASK_ENV=production
EOF

# Deploy com perfil de produção
docker-compose --profile production up -d
```

4. **Configurar monitoramento**
```bash
# Instalar Prometheus e Grafana (opcional)
docker-compose -f monitoring.yml up -d
```

### Configurações de Segurança

1. **Firewall**
```bash
# Configurar UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

2. **Fail2ban**
```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

3. **Backup automático**
```bash
# Criar script de backup
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
docker exec comandas-app_db_1 pg_dump -U comandas_user comandas > $BACKUP_DIR/db_backup_$DATE.sql
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz /opt/comandas-app
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
EOF

chmod +x backup.sh
# Adicionar ao crontab: 0 2 * * * /path/to/backup.sh
```

## 📊 Monitoramento e Logs

### Logs da Aplicação
```bash
# Ver logs do backend
docker-compose logs -f backend

# Ver logs do frontend
docker-compose logs -f frontend

# Ver logs do nginx
docker-compose logs -f nginx
```

### Métricas de Performance
```bash
# Verificar uso de recursos
docker stats

# Verificar logs de acesso
docker exec nginx tail -f /var/log/nginx/access.log
```

### Health Checks
```bash
# Verificar saúde da API
curl https://api.comandas.com/health

# Verificar conectividade do banco
docker exec backend python -c "from database import db; print('DB OK' if db.engine.execute('SELECT 1') else 'DB ERROR')"
```

## 💾 Backup e Recuperação

### Backup Automático
```bash
#!/bin/bash
# Script de backup completo

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Backup do banco de dados
docker exec comandas-app_db_1 pg_dump -U comandas_user comandas > $BACKUP_DIR/db_backup_$DATE.sql

# Backup dos arquivos da aplicação
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz /opt/comandas-app

# Backup das configurações
tar -czf $BACKUP_DIR/config_backup_$DATE.tar.gz /etc/nginx /etc/ssl

# Limpar backups antigos (manter 7 dias)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup concluído: $DATE"
```

### Recuperação
```bash
# Restaurar banco de dados
docker exec -i comandas-app_db_1 psql -U comandas_user comandas < backup_file.sql

# Restaurar aplicação
tar -xzf app_backup_file.tar.gz -C /

# Reiniciar serviços
docker-compose restart
```

## 🔧 Troubleshooting

### Problemas Comuns

1. **Aplicação não inicia**
```bash
# Verificar logs
docker-compose logs backend

# Verificar variáveis de ambiente
docker-compose exec backend env

# Verificar conectividade do banco
docker-compose exec backend python -c "from database import db; db.engine.execute('SELECT 1')"
```

2. **Erro de CORS**
```bash
# Verificar configuração CORS
docker-compose exec backend python -c "from app import app; print(app.config['CORS_ORIGINS'])"
```

3. **Problemas de SSL**
```bash
# Verificar certificados
sudo certbot certificates

# Renovar certificados
sudo certbot renew
```

4. **Problemas de performance**
```bash
# Verificar uso de recursos
docker stats

# Verificar logs de erro
docker-compose logs --tail=100 backend | grep ERROR
```

### Comandos Úteis

```bash
# Reiniciar todos os serviços
docker-compose restart

# Rebuild das imagens
docker-compose build --no-cache

# Verificar status dos containers
docker-compose ps

# Acessar shell do container
docker-compose exec backend bash

# Ver logs em tempo real
docker-compose logs -f
```

## 📞 Suporte

Para problemas específicos ou dúvidas sobre deploy:

1. Verifique os logs primeiro
2. Consulte este documento
3. Abra uma issue no repositório
4. Entre em contato com a equipe de DevOps

---

**Última atualização**: $(date)
**Versão**: 1.0.0 