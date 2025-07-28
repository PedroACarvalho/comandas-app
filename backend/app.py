import sys
import os

# Adicionar o diretório atual ao path para que os imports funcionem
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from flasgger import Swagger
from database import db, init_db
from routes.auth import auth_bp
from routes.orders import orders_bp
from routes.menu import menu_bp
from routes.payment import payment_bp
from routes.tables import mesas_bp
from events import emitir_pedido_novo, emitir_pedido_atualizado, emitir_pagamento_recebido, emitir_mesa_status

def create_app():
    """Cria e configura a aplicação Flask para o sistema de comandas online."""
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.abspath('comandas.db')}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    CORS(app, resources={r"/*": {"origins": "*"}})
    db.init_app(app)
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

@socketio.on('connect')
def handle_connect():
    """Evento de conexão WebSocket."""
    print('Cliente conectado')
    emit('mensagem', {'msg': 'Conectado ao WebSocket!'})

if __name__ == '__main__':
    with app.app_context():
        init_db()
    socketio.run(app, debug=True, host='0.0.0.0', port=5001)
