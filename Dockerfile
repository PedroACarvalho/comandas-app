# Dockerfile para o backend do sistema de comandas
FROM python:3.9-slim

# Definir variáveis de ambiente
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV FLASK_ENV=production

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        build-essential \
        libffi-dev \
        postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements e instalar dependências Python
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY backend/ .

# Criar usuário não-root
RUN adduser --disabled-password --gecos '' appuser
RUN chown -R appuser:appuser /app
USER appuser

# Expor porta
EXPOSE 5001

# Comando para executar a aplicação
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "--workers", "4", "--worker-class", "eventlet", "app:app"] 