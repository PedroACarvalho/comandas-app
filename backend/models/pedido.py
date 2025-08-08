from datetime import datetime
from decimal import Decimal
from database import db


class Pedido(db.Model):
    """Modelo de Pedido, representa um pedido realizado por um cliente."""

    __tablename__ = "pedido"

    pedido_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cliente_id = db.Column(
        db.Integer, db.ForeignKey("cliente.cliente_id"), nullable=False
    )
    status = db.Column(db.String(50), nullable=False, default="Aguardando Seleção")
    data_hora = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    total = db.Column(db.Numeric(10, 2), nullable=False, default=0)
    fechado = db.Column(
        db.Boolean, default=False
    )  # Indica se o pedido foi fechado para pagamento

    # Relacionamentos
    itens = db.relationship(
        "PedidoItem", backref="pedido", cascade="all, delete-orphan"
    )

    def __repr__(self):
        """Retorna representação legível do pedido."""
        return f"<Pedido {self.pedido_id}>"

    def to_dict(self):
        """Converte o pedido para dicionário serializável."""
        return {
            "pedido_id": self.pedido_id,
            "cliente_id": self.cliente_id,
            "status": self.status,
            "data_hora": self.data_hora.isoformat() if self.data_hora else None,
            "total": float(self.total) if self.total else 0.0,
            "fechado": self.fechado,
            "itens": [item.to_dict() for item in self.itens],  # type: ignore
            "cliente": self.cliente.to_dict() if self.cliente else None,
        }
