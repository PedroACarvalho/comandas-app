from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from database import db


class Cliente(db.Model):
    """Modelo de Cliente, representa um cliente associado a uma mesa."""

    __tablename__ = "cliente"

    cliente_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(255), nullable=False)
    mesa = db.Column(db.Integer, nullable=False)

    # Relacionamentos
    pedidos = db.relationship("Pedido", backref="cliente")

    def __repr__(self):
        """Retorna representação legível do cliente."""
        return f"<Cliente {self.nome}>"

    def to_dict(self):
        """Converte o cliente para dicionário serializável."""
        return {"cliente_id": self.cliente_id, "nome": self.nome, "mesa": self.mesa}
