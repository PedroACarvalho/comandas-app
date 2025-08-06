import sys
import os
import logging
from logging.handlers import RotatingFileHandler

# Adicionar o diretório atual ao path para que os imports funcionem
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Imports padrão
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from flasgger import Swagger
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_migrate import Migrate

# Imports locais (após sys.path.insert)
from database import db, init_db
from routes.auth import auth_bp
from routes.orders import orders_bp
from routes.menu import menu_bp
from routes.payment import payment_bp
from routes.tables import mesas_bp
from events import emitir_pedido_novo, emitir_pedido_atualizado, emitir_pagamento_recebido, emitir_mesa_status
from config import config

def create_app(config_name=None):
    """Cria e configura a aplicação Flask para o sistema de comandas online."""
    app = Flask(__name__)
    
    # Determinar configuração baseada em variável de ambiente
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    app.config.from_object(config[config_name])
    
    # Configurar CORS baseado na configuração
    CORS(app, resources={r"/*": {"origins": app.config['CORS_ORIGINS']}})
    
    # Configurar logging
    if not app.debug and not app.testing:
        if not os.path.exists('logs'):
            os.mkdir('logs')
        file_handler = RotatingFileHandler('logs/comandas.log', maxBytes=10240, backupCount=10)
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('Comandas startup')
    
    # Configurar rate limiting
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        default_limits=["200 per day", "50 per hour"]
    )
    
    db.init_app(app)
    migrate = Migrate(app, db)
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(orders_bp, url_prefix='/api')
    app.register_blueprint(menu_bp, url_prefix='/api')
    app.register_blueprint(payment_bp, url_prefix='/api')
    app.register_blueprint(mesas_bp, url_prefix='/api')
    Swagger(app)  # Inicializa Swagger UI

    @app.route('/')
    def hello():
        """Endpoint de teste para verificar se a API está online."""
        return {'message': 'API de Comandas Online funcionando!'}

    @app.route('/api')
    def api_docs():
        """Endpoint de documentação simplificada da API."""
        return {
            'message': 'API de Comandas Online - Documentação',
            'endpoints': {
                'cliente': {
                    'POST /api/cliente': 'Criar novo cliente',
                    'GET /api/cliente/<mesa>': 'Obter cliente por mesa',
                    'DELETE /api/cliente/<id>': 'Remover cliente'
                },
                'itens': {
                    'GET /api/itens': 'Listar todos os itens',
                    'POST /api/itens': 'Criar novo item',
                    'GET /api/itens/<id>': 'Obter item por ID',
                    'PUT /api/itens/<id>': 'Atualizar item',
                    'DELETE /api/itens/<id>': 'Remover item'
                },
                'pedidos': {
                    'POST /api/pedidos': 'Criar novo pedido',
                    'GET /api/pedidos/<id>': 'Obter pedido por ID',
                    'PUT /api/pedidos/<id>/status': 'Atualizar status do pedido',
                    'GET /api/pedidos/cliente/<id>': 'Obter pedidos de um cliente'
                },
                'pagamentos': {
                    'POST /api/pagamentos': 'Criar novo pagamento',
                    'GET /api/pagamentos/<id>': 'Obter pagamento por ID',
                    'GET /api/pagamentos/pedido/<id>': 'Obter pagamento por pedido'
                }
            },
            'exemplos': {
                'criar_cliente': {
                    'url': 'POST /api/cliente',
                    'body': {'nome': 'João Silva', 'mesa': 1}
                },
                'criar_pedido': {
                    'url': 'POST /api/pedidos',
                    'body': {
                        'cliente_id': 1,
                        'itens': [
                            {'item_id': 1, 'quantidade': 2},
                            {'item_id': 3, 'quantidade': 1}
                        ]
                    }
                },
                'fazer_pagamento': {
                    'url': 'POST /api/pagamentos',
                    'body': {
                        'pedido_id': 1,
                        'metodo': 'Cartão de Crédito',
                        'valor': 38.30
                    }
                }
            }
        }
    return app

app = create_app()
socketio = SocketIO(app, cors_allowed_origins="*")
app.socketio = socketio  # Permite acesso via current_app.socketio

# Expor para o Flask CLI
db = db
migrate = Migrate(app, db)

@socketio.on('connect')
def handle_connect():
    """Evento de conexão WebSocket."""
    print('Cliente conectado')
    emit('mensagem', {'msg': 'Conectado ao WebSocket!'})

if __name__ == '__main__':
    with app.app_context():
        init_db()
    
    # Configurar porta baseada em variável de ambiente
    port = int(os.environ.get('PORT', 5001))
    host = os.environ.get('HOST', '0.0.0.0')
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    socketio.run(app, debug=debug, host=host, port=port)
