from database import db

class Establishment(db.Model):
    """Modelo de Estabelecimento, representa um local que utiliza o sistema de comandas."""
    __tablename__ = "establishments"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)  # Nome do estabelecimento
    payment_gateway = db.Column(db.String)  # Ex: "mercadopago"
    mp_access_token = db.Column(db.String)  # Token do Mercado Pago
    mp_public_key = db.Column(db.String)    # Public Key do Mercado Pago
    # ... outros campos