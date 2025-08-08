from flask import Blueprint, request, jsonify
from database import db
from models import Cliente, Mesa

auth_bp = Blueprint("auth", __name__)

# --- Constantes de status ---
STATUS_MESA_OCUPADA = "ocupada"
STATUS_PEDIDO_FECHADO = "Fechado"


# --- Funções auxiliares ---
def fechar_pedidos_abertos_para_mesa(mesa_numero):
    from models import Pedido, Cliente

    pedidos_abertos = (
        Pedido.query.join(Cliente)
        .filter(Cliente.mesa == mesa_numero, Pedido.fechado.is_(False))
        .all()
    )
    for pedido in pedidos_abertos:
        pedido.fechado = True
        pedido.status = STATUS_PEDIDO_FECHADO


def existe_cliente_na_mesa(mesa_numero):
    return Cliente.query.filter_by(mesa=mesa_numero).first() is not None


def atualizar_status_mesa(mesa_numero, status):
    mesa_obj = Mesa.query.filter_by(numero=mesa_numero).first()
    if mesa_obj:
        mesa_obj.status = status


@auth_bp.route("/mesas/disponiveis", methods=["GET"])
def listar_mesas_disponiveis():
    """
    Listar mesas cadastradas e livres e sem cliente ativo
    ---
    tags:
      - Mesas
    responses:
      200:
        description: Lista de mesas disponíveis
        schema:
          type: object
          properties:
            mesas_disponiveis:
              type: array
              items:
                type: object
            total_mesas:
              type: integer
      500:
        description: Erro interno
    """
    try:
        # Buscar mesas livres
        mesas_livres = Mesa.query.filter_by(status="livre").all()
        # Buscar mesas que não têm cliente ativo
        mesas_disponiveis = []
        for mesa in mesas_livres:
            cliente_ativo = Cliente.query.filter_by(mesa=mesa.numero).first()
            if not cliente_ativo:
                mesas_disponiveis.append(mesa)
        return (
            jsonify(
                {
                    "mesas_disponiveis": [mesa.to_dict() for mesa in mesas_disponiveis],
                    "total_mesas": Mesa.query.count(),
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route("/cliente", methods=["POST"])
def criar_cliente():
    """
    Cria um novo cliente e atualiza status da mesa.
    ---
    tags:
      - Clientes
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - nome
            - mesa
          properties:
            nome:
              type: string
              example: João Silva
            mesa:
              type: integer
              example: 1
    responses:
      201:
        description: Cliente criado com sucesso
        schema:
          type: object
          properties:
            message:
              type: string
            cliente:
              type: object
      400:
        description: Dados inválidos ou mesa ocupada
      500:
        description: Erro interno
    """
    try:
        data = request.get_json()
        if not data or "nome" not in data or "mesa" not in data:
            return jsonify({"error": "Nome e mesa são obrigatórios"}), 400

        fechar_pedidos_abertos_para_mesa(data["mesa"])

        if existe_cliente_na_mesa(data["mesa"]):
            return jsonify({"error": "Já existe um cliente nesta mesa"}), 400

        novo_cliente = Cliente(nome=data["nome"], mesa=data["mesa"])
        db.session.add(novo_cliente)
        atualizar_status_mesa(data["mesa"], STATUS_MESA_OCUPADA)
        db.session.commit()
        return (
            jsonify(
                {
                    "message": "Cliente criado com sucesso",
                    "cliente": novo_cliente.to_dict(),
                }
            ),
            201,
        )
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@auth_bp.route("/cliente/<int:mesa>", methods=["GET"])
def obter_cliente_por_mesa(mesa):
    """
    Obter cliente por número da mesa
    ---
    tags:
      - Clientes
    parameters:
      - in: path
        name: mesa
        type: integer
        required: true
        description: Número da mesa
    responses:
      200:
        description: Cliente encontrado
        schema:
          type: object
          properties:
            cliente:
              type: object
      404:
        description: Cliente não encontrado
      500:
        description: Erro interno
    """
    try:
        cliente = Cliente.query.filter_by(mesa=mesa).first()

        if not cliente:
            return jsonify({"error": "Cliente não encontrado"}), 404

        return jsonify({"cliente": cliente.to_dict()}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route("/cliente/<int:cliente_id>", methods=["DELETE"])
def remover_cliente(cliente_id):
    """
    Remover cliente (só se não houver pedidos associados)
    ---
    tags:
      - Clientes
    parameters:
      - in: path
        name: cliente_id
        type: integer
        required: true
        description: ID do cliente
    responses:
      200:
        description: Cliente removido com sucesso
        schema:
          type: object
          properties:
            message:
              type: string
      400:
        description: Não é possível remover cliente com pedidos associados
      404:
        description: Cliente não encontrado
      500:
        description: Erro interno
    """
    try:
        cliente = db.session.get(Cliente, cliente_id)
        if not cliente:
            return jsonify({"error": "Cliente não encontrado"}), 404
        if cliente.pedidos and len(cliente.pedidos) > 0:
            return (
                jsonify(
                    {"error": "Não é possível remover cliente com pedidos associados"}
                ),
                400,
            )
        db.session.delete(cliente)
        db.session.commit()
        return jsonify({"message": "Cliente removido com sucesso"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
