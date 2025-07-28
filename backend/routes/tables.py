import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from flask import Blueprint, request, jsonify
from database import db
from models import Mesa

# Blueprint para mesas
mesas_bp = Blueprint('mesas', __name__)

# --- Constantes de mensagens de erro ---
ERRO_MESA_NAO_ENCONTRADA = 'Mesa não encontrada'
ERRO_NUMERO_CAPACIDADE_OBRIGATORIOS = 'Número e capacidade são obrigatórios'
ERRO_MESA_DUPLICADA = 'Já existe uma mesa com esse número'

@mesas_bp.route('/mesas', methods=['GET'])
def listar_mesas():
    """
    Lista todas as mesas cadastradas.
    ---
    tags:
      - Mesas
    responses:
      200:
        description: Lista de mesas
        schema:
          type: array
          items:
            type: object
      500:
        description: Erro interno
    """
    mesas = Mesa.query.all()
    return jsonify([mesa.to_dict() for mesa in mesas]), 200

@mesas_bp.route('/mesas/<int:mesa_id>', methods=['GET'])
def obter_mesa(mesa_id):
    """
    Obtém uma mesa pelo ID.
    ---
    tags:
      - Mesas
    parameters:
      - in: path
        name: mesa_id
        type: integer
        required: true
        description: ID da mesa
    responses:
      200:
        description: Mesa encontrada
        schema:
          type: object
      404:
        description: Mesa não encontrada
      500:
        description: Erro interno
    """
    mesa = Mesa.query.get(mesa_id)
    if not mesa:
        return jsonify({'error': ERRO_MESA_NAO_ENCONTRADA}), 404
    return jsonify(mesa.to_dict()), 200

@mesas_bp.route('/mesas', methods=['POST'])
def criar_mesa():
    """
    Cria uma nova mesa.
    ---
    tags:
      - Mesas
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - numero
            - capacidade
          properties:
            numero:
              type: integer
              example: 10
            capacidade:
              type: integer
              example: 4
    responses:
      201:
        description: Mesa criada com sucesso
        schema:
          type: object
      400:
        description: Dados inválidos ou mesa duplicada
      500:
        description: Erro interno
    """
    data = request.get_json()
    if not data or 'numero' not in data or 'capacidade' not in data:
        return jsonify({'error': ERRO_NUMERO_CAPACIDADE_OBRIGATORIOS}), 400
    if Mesa.query.filter_by(numero=data['numero']).first():
        return jsonify({'error': ERRO_MESA_DUPLICADA}), 400
    mesa = Mesa(
        numero=data['numero'],
        capacidade=data['capacidade'],
    )
    db.session.add(mesa)
    db.session.commit()
    return jsonify(mesa.to_dict()), 201

@mesas_bp.route('/mesas/<int:mesa_id>', methods=['PUT'])
def editar_mesa(mesa_id):
    """
    Edita uma mesa existente pelo ID.
    ---
    tags:
      - Mesas
    parameters:
      - in: path
        name: mesa_id
        type: integer
        required: true
        description: ID da mesa
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            numero:
              type: integer
              example: 11
            capacidade:
              type: integer
              example: 6
    responses:
      200:
        description: Mesa editada com sucesso
        schema:
          type: object
      400:
        description: Dados inválidos ou mesa duplicada
      404:
        description: Mesa não encontrada
      500:
        description: Erro interno
    """
    mesa = Mesa.query.get(mesa_id)
    if not mesa:
        return jsonify({'error': ERRO_MESA_NAO_ENCONTRADA}), 404
    data = request.get_json()
    if 'numero' in data:
        if Mesa.query.filter(Mesa.numero == data['numero'], Mesa.mesa_id != mesa_id).first():
            return jsonify({'error': ERRO_MESA_DUPLICADA}), 400
        mesa.numero = data['numero']
    if 'capacidade' in data:
        mesa.capacidade = data['capacidade']
    db.session.commit()
    return jsonify(mesa.to_dict()), 200

@mesas_bp.route('/mesas/<int:mesa_id>', methods=['DELETE'])
def deletar_mesa(mesa_id):
    """
    Deleta uma mesa pelo ID.
    ---
    tags:
      - Mesas
    parameters:
      - in: path
        name: mesa_id
        type: integer
        required: true
        description: ID da mesa
    responses:
      200:
        description: Mesa deletada com sucesso
        schema:
          type: object
          properties:
            message:
              type: string
      404:
        description: Mesa não encontrada
      500:
        description: Erro interno
    """
    mesa = Mesa.query.get(mesa_id)
    if not mesa:
        return jsonify({'error': ERRO_MESA_NAO_ENCONTRADA}), 404
    db.session.delete(mesa)
    db.session.commit()
    return jsonify({'message': 'Mesa deletada com sucesso'}), 200
