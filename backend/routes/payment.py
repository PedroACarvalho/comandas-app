from flask import Blueprint, request, jsonify
from database import db
from models import Pagamento, Pedido
from datetime import datetime

payment_bp = Blueprint('payment', __name__)

# --- Constantes de status ---
STATUS_PEDIDO_PAGO = "Pago"
STATUS_MESA_LIVRE = "livre"

# --- Função utilitária para liberar mesa ---
def liberar_mesa(cliente):
    """Libera a mesa associada ao cliente, sem remover ou alterar o cliente."""
    from models import Mesa
    if cliente:
        mesa = Mesa.query.filter_by(numero=cliente.mesa).first()
        if mesa:
            mesa.status = STATUS_MESA_LIVRE

@payment_bp.route('/pagamentos', methods=['POST'])
def criar_pagamento():
    """
    Cria um novo pagamento e libera a mesa se necessário.
    ---
    tags:
      - Pagamentos
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - pedido_id
            - metodo
            - valor
          properties:
            pedido_id:
              type: integer
              example: 1
            metodo:
              type: string
              example: Dinheiro
            valor:
              type: number
              example: 38.30
    responses:
      201:
        description: Pagamento criado com sucesso
        schema:
          type: object
          properties:
            message:
              type: string
            pagamento:
              type: object
      400:
        description: Dados inválidos, pedido já pago ou pedido não fechado
      404:
        description: Pedido não encontrado
      500:
        description: Erro interno
    """
    try:
        data = request.get_json()
        if not data or 'pedido_id' not in data or 'metodo' not in data or 'valor' not in data:
            return jsonify({'error': 'pedido_id, metodo e valor são obrigatórios'}), 400
        pedido = Pedido.query.get(data['pedido_id'])
        if not pedido:
            return jsonify({'error': 'Pedido não encontrado'}), 404
        pagamento_existente = Pagamento.query.filter_by(pedido_id=data['pedido_id']).first()
        if pagamento_existente:
            return jsonify({'error': 'Já existe pagamento para este pedido'}), 400
        if not pedido.fechado:
            return jsonify({'error': 'Pedido deve estar fechado para pagamento'}), 400
        novo_pagamento = Pagamento(
            pedido_id=data['pedido_id'],
            metodo=data['metodo'],
            valor=data['valor']
        )
        db.session.add(novo_pagamento)
        pedido.status = STATUS_PEDIDO_PAGO
        # Liberar a mesa
        liberar_mesa(pedido.cliente)
        db.session.commit()
        return jsonify({
            'message': 'Pagamento criado com sucesso',
            'pagamento': novo_pagamento.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/pagamentos/<int:pagamento_id>', methods=['GET'])
def obter_pagamento(pagamento_id):
    """
    Obter pagamento por ID
    ---
    tags:
      - Pagamentos
    parameters:
      - in: path
        name: pagamento_id
        type: integer
        required: true
        description: ID do pagamento
    responses:
      200:
        description: Pagamento encontrado
        schema:
          type: object
          properties:
            pagamento:
              type: object
      404:
        description: Pagamento não encontrado
      500:
        description: Erro interno
    """
    try:
        pagamento = Pagamento.query.get(pagamento_id)
        
        if not pagamento:
            return jsonify({'error': 'Pagamento não encontrado'}), 404
        
        return jsonify({
            'pagamento': pagamento.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/pagamentos/pedido/<int:pedido_id>', methods=['GET'])
def obter_pagamento_por_pedido(pedido_id):
    """
    Obter pagamento de um pedido específico
    ---
    tags:
      - Pagamentos
    parameters:
      - in: path
        name: pedido_id
        type: integer
        required: true
        description: ID do pedido
    responses:
      200:
        description: Pagamento encontrado
        schema:
          type: object
          properties:
            pagamento:
              type: object
      404:
        description: Pagamento não encontrado
      500:
        description: Erro interno
    """
    try:
        pagamento = Pagamento.query.filter_by(pedido_id=pedido_id).first()
        
        if not pagamento:
            return jsonify({'error': 'Pagamento não encontrado'}), 404
        
        return jsonify({
            'pagamento': pagamento.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500 