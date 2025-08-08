# 🚀 Guia de Deploy para VPS - Sistema de Comandas Online

## 📋 Pré-requisitos

### 1. VPS Configurada
- **Sistema**: Ubuntu 20.04+ ou Debian 11+
- **RAM**: Mínimo 2GB (recomendado 4GB+)
- **CPU**: 2 cores mínimo
- **Disco**: 20GB mínimo
- **Portas**: 80, 443, 22 abertas

### 2. Domínio (Opcional mas Recomendado)
- Domínio configurado com DNS apontando para o IP da VPS
- Certificado SSL (Let's Encrypt)

## 🔧 Instalação das Dependências

### 1. Atualizar Sistema
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instalar Docker
```bash
# Instalar dependências
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Adicionar repositório oficial do Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Habilitar Docker no boot
sudo systemctl enable docker
sudo systemctl start docker
```

### 3. Instalar Docker Compose
```bash
# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalação
docker-compose --version
```

### 4. Instalar Ferramentas Úteis
```bash
sudo apt install -y curl wget git htop ufw
```

## 📦 Deploy do Sistema

### 1. Clonar/Transferir o Projeto
```bash
# Se usando Git
git clone https://github.com/seu-usuario/comandas-app.git
cd comandas-app

# Ou transferir via SCP/SFTP
```

### 2. Tornar o Script Executável
```bash
chmod +x deploy-vps.sh
```

### 3. Executar Deploy
```bash
# Deploy em produção
./deploy-vps.sh production

# Ou deploy em staging
./deploy-vps.sh staging
```

## ⚙️ Configuração Pós-Deploy

### 1. Configurar Firewall
```bash
# Configurar UFW
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. Configurar SSL (Let's Encrypt)
```bash
# Instalar Certbot
sudo apt install -y certbot

# Obter certificado (substitua pelo seu domínio)
sudo certbot certonly --standalone -d seu-dominio.com -d www.seu-dominio.com

# Configurar renovação automática
sudo crontab -e
# Adicionar linha: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 3. Configurar Nginx com SSL
```bash
# Editar nginx.conf para incluir SSL
sudo nano nginx.conf
```

Adicionar configuração SSL:
```nginx
# Servidor HTTPS
server {
    listen 443 ssl http2;
    server_name seu-dominio.com www.seu-dominio.com;

    # Certificados SSL
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;

    # ... resto da configuração
}
```

## 🔍 Verificação e Monitoramento

### 1. Verificar Status
```bash
# Status dos containers
./deploy-vps.sh production status

# Ver logs
./deploy-vps.sh production logs
```

### 2. Testar Endpoints
```bash
# Testar frontend
curl -I http://localhost

# Testar backend
curl -I http://localhost:5001

# Testar health check
curl http://localhost/health
```

### 3. Monitoramento de Recursos
```bash
# Ver uso de recursos
docker stats

# Ver logs em tempo real
docker-compose logs -f
```

## 🔧 Comandos Úteis

### Gerenciamento de Serviços
```bash
# Reiniciar serviços
./deploy-vps.sh production restart

# Parar serviços
./deploy-vps.sh production stop

# Fazer backup
./deploy-vps.sh production backup
```

### Logs e Debug
```bash
# Logs do backend
docker-compose logs backend

# Logs do frontend
docker-compose logs frontend

# Logs do nginx
docker-compose logs nginx

# Entrar no container
docker-compose exec backend bash
```

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Containers não iniciam
```bash
# Verificar logs
docker-compose logs

# Verificar recursos
docker system df

# Limpar recursos não utilizados
docker system prune -a
```

#### 2. Problemas de Porta
```bash
# Verificar portas em uso
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# Verificar se containers estão rodando
docker-compose ps
```

#### 3. Problemas de Banco de Dados
```bash
# Verificar logs do banco
docker-compose logs db

# Conectar ao banco
docker-compose exec db psql -U comandas_user -d comandas

# Fazer backup manual
docker-compose exec db pg_dump -U comandas_user comandas > backup.sql
```

#### 4. Problemas de Memória
```bash
# Verificar uso de memória
free -h

# Verificar swap
swapon --show

# Criar swap se necessário
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## 📊 Monitoramento Avançado

### 1. Instalar Prometheus + Grafana (Opcional)
```bash
# Criar diretório para monitoramento
mkdir monitoring
cd monitoring

# Criar docker-compose para monitoramento
cat > docker-compose.monitoring.yml << EOF
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    volumes:
      - grafana_data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin

volumes:
  prometheus_data:
  grafana_data:
EOF
```

### 2. Configurar Alertas
```bash
# Criar script de monitoramento
cat > monitor.sh << 'EOF'
#!/bin/bash

# Verificar se serviços estão rodando
if ! docker-compose ps | grep -q "Up"; then
    echo "ALERTA: Serviços não estão rodando!"
    # Enviar notificação (email, Slack, etc.)
fi

# Verificar uso de disco
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "ALERTA: Disco com $DISK_USAGE% de uso!"
fi
EOF

chmod +x monitor.sh
```

## 🔒 Segurança

### 1. Configurações de Segurança
```bash
# Atualizar chaves secretas
nano .env
# Alterar SECRET_KEY e JWT_SECRET_KEY

# Configurar firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. Backup Automático
```bash
# Criar script de backup automático
cat > backup-cron.sh << 'EOF'
#!/bin/bash
cd /path/to/comandas-app
./deploy-vps.sh production backup
EOF

# Adicionar ao crontab
crontab -e
# Adicionar: 0 2 * * * /path/to/backup-cron.sh
```

## 📈 Escalabilidade

### 1. Load Balancer (Opcional)
```bash
# Instalar HAProxy
sudo apt install -y haproxy

# Configurar HAProxy
sudo nano /etc/haproxy/haproxy.cfg
```

### 2. CDN (Opcional)
- Configurar Cloudflare ou similar
- Configurar cache para arquivos estáticos

## 🎯 Checklist de Deploy

- [ ] VPS configurada com requisitos mínimos
- [ ] Docker e Docker Compose instalados
- [ ] Projeto transferido para VPS
- [ ] Script de deploy executado com sucesso
- [ ] Containers rodando (docker-compose ps)
- [ ] Frontend acessível (curl localhost)
- [ ] Backend acessível (curl localhost:5001)
- [ ] SSL configurado (se aplicável)
- [ ] Firewall configurado
- [ ] Backup configurado
- [ ] Monitoramento configurado

## 📞 Suporte

Se encontrar problemas:

1. **Verificar logs**: `./deploy-vps.sh production logs`
2. **Verificar status**: `./deploy-vps.sh production status`
3. **Reiniciar serviços**: `./deploy-vps.sh production restart`
4. **Fazer backup antes de mudanças**: `./deploy-vps.sh production backup`

## 🚀 Próximos Passos

Após o deploy bem-sucedido:

1. **Configurar domínio** e SSL
2. **Configurar monitoramento** avançado
3. **Implementar backup** automático
4. **Configurar alertas** de sistema
5. **Otimizar performance** conforme necessário

---

**🎉 Parabéns! Seu sistema de comandas está rodando em produção!**
