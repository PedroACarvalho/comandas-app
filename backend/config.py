import os
from datetime import timedelta

class Config:
    """Configuração base para todos os ambientes."""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')
    
    # Configurações de segurança
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # Configurações de logging
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    
    # Configurações de rate limiting
    RATELIMIT_ENABLED = True
    RATELIMIT_STORAGE_URL = os.environ.get('REDIS_URL', 'memory://')

class DevelopmentConfig(Config):
    """Configuração para desenvolvimento."""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///comandas.db'
    CORS_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173']

class StagingConfig(Config):
    """Configuração para homologação."""
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'https://staging.comandas.com').split(',')
    
    # Configurações de segurança para staging
    WTF_CSRF_ENABLED = True
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True

class ProductionConfig(Config):
    """Configuração para produção."""
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'https://comandas.com').split(',')
    
    # Configurações de segurança para produção
    WTF_CSRF_ENABLED = True
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    
    # Configurações de performance
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_size': 10,
        'pool_recycle': 3600,
        'pool_pre_ping': True
    }

# Mapeamento de configurações
config = {
    'development': DevelopmentConfig,
    'staging': StagingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
} 