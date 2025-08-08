from datetime import datetime
from decimal import Decimal
from database import db


class Pagamento(db.Model):
    """Modelo de Pagamento, representa um pagamento realizado para um pedido."""

    __tablename__ = "pagamento"

    pagamento_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    pedido_id = db.Column(db.Integer, db.ForeignKey("pedido.pedido_id"), nullable=False)
    metodo = db.Column(db.String(50), nullable=False)
    valor = db.Column(db.Numeric(10, 2), nullable=False)
    valor_pago = db.Column(
        db.Numeric(10, 2), nullable=True
    )  # Para pagamentos em dinheiro
    troco = db.Column(db.Numeric(10, 2), nullable=True)  # Troco calculado
    data_hora = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        """Retorna representação legível do pagamento."""
        return f"<Pagamento {self.pagamento_id}>"

    def to_dict(self):
        """Converte o pagamento para dicionário serializável."""
        return {
            "pagamento_id": self.pagamento_id,
            "pedido_id": self.pedido_id,
            "metodo": self.metodo,
            "valor": float(self.valor) if self.valor else 0.0,
            "valor_pago": float(self.valor_pago) if self.valor_pago else None,
            "troco": float(self.troco) if self.troco else None,
            "data_hora": self.data_hora.isoformat() if self.data_hora else None,
        }
