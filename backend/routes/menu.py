from flask import Blueprint, request, jsonify
from database import db
from models import Item

menu_bp = Blueprint("menu", __name__)

# --- Constantes de mensagens de erro ---
ERRO_ITEM_NAO_ENCONTRADO = "Item não encontrado"
ERRO_NOME_PRECO_OBRIGATORIOS = "Nome e preço são obrigatórios"


@menu_bp.route("/itens", methods=["GET"])
def listar_itens():
    """
    Lista todos os itens do menu.
    ---
    tags:
      - Itens
    responses:
      200:
        description: Lista de itens
        schema:
          type: object
          properties:
            itens:
              type: array
              items:
                type: object
      500:
        description: Erro interno
    """
    try:
        itens = Item.query.all()
        return jsonify({"itens": [item.to_dict() for item in itens]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@menu_bp.route("/itens", methods=["POST"])
def criar_item():
    """
    Cria um novo item no menu.
    ---
    tags:
      - Itens
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - nome
            - preco
          properties:
            nome:
              type: string
              example: Coca-Cola
            descricao:
              type: string
              example: Refrigerante lata
            preco:
              type: number
              example: 5.0
    responses:
      201:
        description: Item criado com sucesso
        schema:
          type: object
          properties:
            message:
              type: string
            item:
              type: object
      400:
        description: Dados inválidos
      500:
        description: Erro interno
    """
    try:
        data = request.get_json()
        if not data or "nome" not in data or "preco" not in data:
            return jsonify({"error": ERRO_NOME_PRECO_OBRIGATORIOS}), 400
        novo_item = Item(
            nome=data["nome"], descricao=data.get("descricao", ""), preco=data["preco"]
        )
        db.session.add(novo_item)
        db.session.commit()
        return (
            jsonify(
                {"message": "Item criado com sucesso", "item": novo_item.to_dict()}
            ),
            201,
        )
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@menu_bp.route("/itens/<int:item_id>", methods=["GET"])
def obter_item(item_id):
    """
    Obtém um item do menu pelo ID.
    ---
    tags:
      - Itens
    parameters:
      - in: path
        name: item_id
        type: integer
        required: true
        description: ID do item
    responses:
      200:
        description: Item encontrado
        schema:
          type: object
          properties:
            item:
              type: object
      404:
        description: Item não encontrado
      500:
        description: Erro interno
    """
    try:
        item = db.session.get(Item, item_id)
        if not item:
            return jsonify({"error": ERRO_ITEM_NAO_ENCONTRADO}), 404
        return jsonify({"item": item.to_dict()}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@menu_bp.route("/itens/<int:item_id>", methods=["PUT"])
def atualizar_item(item_id):
    """
    Atualiza um item do menu pelo ID.
    ---
    tags:
      - Itens
    parameters:
      - in: path
        name: item_id
        type: integer
        required: true
        description: ID do item
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            nome:
              type: string
              example: Coca Zero
            descricao:
              type: string
              example: Refrigerante zero açúcar
            preco:
              type: number
              example: 6.0
    responses:
      200:
        description: Item atualizado com sucesso
        schema:
          type: object
          properties:
            message:
              type: string
            item:
              type: object
      404:
        description: Item não encontrado
      500:
        description: Erro interno
    """
    try:
        data = request.get_json()
        item = db.session.get(Item, item_id)
        if not item:
            return jsonify({"error": ERRO_ITEM_NAO_ENCONTRADO}), 404
        if "nome" in data:
            item.nome = data["nome"]
        if "descricao" in data:
            item.descricao = data["descricao"]
        if "preco" in data:
            item.preco = data["preco"]
        db.session.commit()
        return (
            jsonify({"message": "Item atualizado com sucesso", "item": item.to_dict()}),
            200,
        )
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@menu_bp.route("/itens/<int:item_id>", methods=["DELETE"])
def remover_item(item_id):
    """
    Remove um item do menu pelo ID.
    ---
    tags:
      - Itens
    parameters:
      - in: path
        name: item_id
        type: integer
        required: true
        description: ID do item
    responses:
      200:
        description: Item removido com sucesso
        schema:
          type: object
          properties:
            message:
              type: string
      404:
        description: Item não encontrado
      500:
        description: Erro interno
    """
    try:
        item = db.session.get(Item, item_id)
        if not item:
            return jsonify({"error": ERRO_ITEM_NAO_ENCONTRADO}), 404
        db.session.delete(item)
        db.session.commit()
        return jsonify({"message": "Item removido com sucesso"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@menu_bp.route("/categorias", methods=["GET"])
def listar_categorias():
    """
    Lista todas as categorias de itens.
    ---
    tags:
      - Categorias
    responses:
      200:
        description: Lista de categorias
        schema:
          type: object
          properties:
            categorias:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
                  nome:
                    type: string
                  descricao:
                    type: string
      500:
        description: Erro interno
    """
    try:
        # Por enquanto, retornar categorias padrão
        # TODO: Implementar modelo de Categoria quando necessário
        categorias = [
            {"id": 1, "nome": "Entradas", "descricao": "Pratos de entrada"},
            {"id": 2, "nome": "Pratos Principais", "descricao": "Pratos principais"},
            {"id": 3, "nome": "Sobremesas", "descricao": "Sobremesas e doces"},
            {"id": 4, "nome": "Bebidas", "descricao": "Bebidas e refrigerantes"},
            {
                "id": 5,
                "nome": "Acompanhamentos",
                "descricao": "Acompanhamentos e extras",
            },
        ]
        return jsonify({"categorias": categorias}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@menu_bp.route("/categorias", methods=["POST"])
def criar_categoria():
    """
    Cria uma nova categoria.
    ---
    tags:
      - Categorias
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - nome
          properties:
            nome:
              type: string
              example: Saladas
            descricao:
              type: string
              example: Saladas frescas
    responses:
      201:
        description: Categoria criada com sucesso
        schema:
          type: object
          properties:
            message:
              type: string
            categoria:
              type: object
      400:
        description: Dados inválidos
      500:
        description: Erro interno
    """
    try:
        data = request.get_json()
        if not data or "nome" not in data:
            return jsonify({"error": "Nome da categoria é obrigatório"}), 400

        # TODO: Implementar criação real de categoria
        categorias = [
            {"id": 1, "nome": "Entradas", "descricao": "Pratos de entrada"},
            {"id": 2, "nome": "Pratos Principais", "descricao": "Pratos principais"},
            {"id": 3, "nome": "Sobremesas", "descricao": "Sobremesas e doces"},
            {"id": 4, "nome": "Bebidas", "descricao": "Bebidas e refrigerantes"},
            {
                "id": 5,
                "nome": "Acompanhamentos",
                "descricao": "Acompanhamentos e extras",
            },
        ]
        nova_categoria = {
            "id": len(categorias) + 1,
            "nome": data["nome"],
            "descricao": data.get("descricao", ""),
        }

        return (
            jsonify(
                {"message": "Categoria criada com sucesso", "categoria": nova_categoria}
            ),
            201,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500
