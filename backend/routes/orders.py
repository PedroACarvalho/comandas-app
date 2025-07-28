from flask import Blueprint, request, jsonify, current_app
from database import db
from models import Pedido, PedidoItem, Item, Cliente
from datetime import datetime
from decimal import Decimal
from events import emitir_pedido_novo, emitir_pedido_atualizado

orders_bp = Blueprint('orders', __name__)

# --- Constantes de status ---
STATUS_PEDIDO_COZINHA = "Cozinha"
STATUS_PEDIDO_FECHADO = "Fechado"
STATUS_PEDIDO_PAGO = "Pago"
STATUS_PEDIDO_AGUARDANDO_PAGAMENTO = "Aguardando Pagamento"
STATUS_MESA_LIVRE = "livre"

# --- Função utilitária para liberar mesa e remover cliente ---
def liberar_mesa_e_remover_cliente(cliente):
    """Libera a mesa associada ao cliente e remove o cliente do banco."""
    from models import Mesa
    if cliente:
        mesa = Mesa.query.filter_by(numero=cliente.mesa).first()
        if mesa:
            mesa.status = STATUS_MESA_LIVRE
        db.session.delete(cliente)

@orders_bp.route('/pedidos', methods=['POST'])
def criar_pedido():
    """
    Cria um novo pedido ou adiciona itens a um pedido existente para um cliente.
    ---
    tags:
      - Pedidos
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - cliente_id
            - itens
          properties:
            cliente_id:
              type: integer
              example: 1
            itens:
              type: array
              items:
                type: object
                properties:
                  item_id:
                    type: integer
                    example: 2
                  quantidade:
                    type: integer
                    example: 1
    responses:
      201:
        description: Pedido criado/adicionado com sucesso
        schema:
          type: object
          properties:
            message:
              type: string
            pedido:
              type: object
      400:
        description: Dados inválidos ou item não encontrado
      404:
        description: Cliente não encontrado
      500:
        description: Erro interno
    """
    try:
        data = request.get_json()
        if not data or 'cliente_id' not in data or 'itens' not in data:
            return jsonify({'error': 'cliente_id e itens são obrigatórios'}), 400
        # Verificar se cliente existe
        cliente = Cliente.query.get(data['cliente_id'])
        if not cliente:
            return jsonify({'error': 'Cliente não encontrado'}), 404
        # Verificar se já existe um pedido aberto para este cliente
        pedido_existente = Pedido.query.filter_by(
            cliente_id=data['cliente_id'],
            fechado=False
        ).first()
        if pedido_existente:
            pedido = pedido_existente
            pedido.status = STATUS_PEDIDO_COZINHA
        else:
            pedido = Pedido(
                cliente_id=data['cliente_id'],
                status=STATUS_PEDIDO_COZINHA,
                total=Decimal('0.00'),
                fechado=False
            )
            db.session.add(pedido)
            db.session.flush()  # Para obter o ID do pedido
        # Adicionar itens
        total_adicionado = Decimal('0.00')
        for item_data in data['itens']:
            item = Item.query.get(item_data['item_id'])
            if not item:
                return jsonify({'error': f'Item {item_data["item_id"]} não encontrado'}), 404
            item_existente = PedidoItem.query.filter_by(
                pedido_id=pedido.pedido_id,
                item_id=item_data['item_id']
            ).first()
            if item_existente:
                item_existente.quantidade += item_data['quantidade']
                total_adicionado += Decimal(str(item.preco)) * item_data['quantidade']
            else:
                pedido_item = PedidoItem(
                    pedido_id=pedido.pedido_id,
                    item_id=item_data['item_id'],
                    quantidade=item_data['quantidade']
                )
                db.session.add(pedido_item)
                total_adicionado += Decimal(str(item.preco)) * item_data['quantidade']
        pedido.total += total_adicionado
        db.session.commit()
        emitir_pedido_novo(current_app.socketio, pedido.to_dict())
        return jsonify({
            'message': 'Itens adicionados ao pedido com sucesso',
            'pedido': pedido.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/pedidos', methods=['GET'])
def listar_pedidos():
    """
    Listar todos os pedidos
    ---
    tags:
      - Pedidos
    responses:
      200:
        description: Lista de pedidos
        schema:
          type: object
          properties:
            pedidos:
              type: array
              items:
                type: object
      500:
        description: Erro interno
    """
    try:
        pedidos = Pedido.query.all()
        return jsonify({
            'pedidos': [pedido.to_dict() for pedido in pedidos]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/pedidos/<int:pedido_id>', methods=['GET'])
def obter_pedido(pedido_id):
    """
    Obter pedido por ID
    ---
    tags:
      - Pedidos
    parameters:
      - in: path
        name: pedido_id
        type: integer
        required: true
        description: ID do pedido
    responses:
      200:
        description: Pedido encontrado
        schema:
          type: object
          properties:
            pedido:
              type: object
      404:
        description: Pedido não encontrado
      500:
        description: Erro interno
    """
    try:
        pedido = Pedido.query.get(pedido_id)

        if not pedido:
            return jsonify({'error': 'Pedido não encontrado'}), 404

        return jsonify({
            'pedido': pedido.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/pedidos/<int:pedido_id>/status', methods=['PUT'])
def atualizar_status_pedido(pedido_id):
    """
    Atualiza o status do pedido. Se status for 'Pago', libera a mesa (não remove mais o cliente).
    ---
    tags:
      - Pedidos
    parameters:
      - in: path
        name: pedido_id
        type: integer
        required: true
        description: ID do pedido
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - status
          properties:
            status:
              type: string
              example: Pago
    responses:
      200:
        description: Status atualizado com sucesso
        schema:
          type: object
          properties:
            message:
              type: string
            pedido:
              type: object
      400:
        description: Status obrigatório
      404:
        description: Pedido não encontrado
      500:
        description: Erro interno
    """
    try:
        data = request.get_json()
        if not data or 'status' not in data:
            return jsonify({'error': 'Status é obrigatório'}), 400
        pedido = Pedido.query.get(pedido_id)
        if not pedido:
            return jsonify({'error': 'Pedido não encontrado'}), 404
        pedido.status = data['status']
        pedido_dict = pedido.to_dict()  # Salva antes de liberar/remover cliente
        # Se o status for 'Pago', liberar a mesa
        if data['status'].lower() == STATUS_PEDIDO_PAGO.lower():
            from routes.payment import liberar_mesa
            liberar_mesa(pedido.cliente)
        db.session.commit()
        emitir_pedido_atualizado(current_app.socketio, pedido_dict)
        return jsonify({
            'message': 'Status atualizado com sucesso',
            'pedido': pedido_dict
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/pedidos/cliente/<int:cliente_id>', methods=['GET'])
def obter_pedidos_cliente(cliente_id):
    """
    Obter todos os pedidos de um cliente
    ---
    tags:
      - Pedidos
    parameters:
      - in: path
        name: cliente_id
        type: integer
        required: true
        description: ID do cliente
    responses:
      200:
        description: Lista de pedidos do cliente
        schema:
          type: object
          properties:
            pedidos:
              type: array
              items:
                type: object
      500:
        description: Erro interno
    """
    try:
        pedidos = Pedido.query.filter_by(cliente_id=cliente_id).all()

        return jsonify({
            'pedidos': [pedido.to_dict() for pedido in pedidos]
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/pedidos/cliente/<int:cliente_id>/ativo', methods=['GET'])
def obter_pedido_ativo_cliente(cliente_id):
    """
    Obter pedido ativo (não fechado) de um cliente
    ---
    tags:
      - Pedidos
    parameters:
      - in: path
        name: cliente_id
        type: integer
        required: true
        description: ID do cliente
    responses:
      200:
        description: Pedido ativo encontrado
        schema:
          type: object
          properties:
            pedido:
              type: object
      404:
        description: Nenhum pedido ativo encontrado
      500:
        description: Erro interno
    """
    try:
        pedido = Pedido.query.filter_by(
            cliente_id=cliente_id,
            fechado=False
        ).first()

        if not pedido:
            return jsonify({'error': 'Nenhum pedido ativo encontrado'}), 404

        return jsonify({
            'pedido': pedido.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/pedidos/<int:pedido_id>/fechar', methods=['POST'])
def fechar_pedido(pedido_id):
    """
    Fechar pedido para pagamento
    ---
    tags:
      - Pedidos
    parameters:
      - in: path
        name: pedido_id
        type: integer
        required: true
        description: ID do pedido
    responses:
      200:
        description: Pedido fechado com sucesso
        schema:
          type: object
          properties:
            message:
              type: string
            pedido:
              type: object
      400:
        description: Pedido já está fechado
      404:
        description: Pedido não encontrado
      500:
        description: Erro interno
    """
    try:
        pedido = Pedido.query.get(pedido_id)
        if not pedido:
            return jsonify({'error': 'Pedido não encontrado'}), 404

        if pedido.fechado:
            return jsonify({'error': 'Pedido já está fechado'}), 400

        pedido.fechado = True
        pedido.status = STATUS_PEDIDO_AGUARDANDO_PAGAMENTO
        db.session.commit()

        return jsonify({
            'message': 'Pedido fechado com sucesso',
            'pedido': pedido.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
