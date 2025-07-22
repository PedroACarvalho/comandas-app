from datetime import datetime
from database import db

class Item(db.Model):
    """Modelo de Item, representa um produto do menu."""
    __tablename__ = 'item'
    
    item_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(255), nullable=False)
    descricao = db.Column(db.Text)
    preco = db.Column(db.Numeric(10, 2), nullable=False)
    
    # Relacionamentos
    pedido_itens = db.relationship('PedidoItem', backref='item', cascade='all, delete-orphan')

    def __repr__(self):
        """Retorna representação legível do item."""
        return f'<Item {self.nome}>'

    def to_dict(self):
        """Converte o item para dicionário serializável."""
        return {
            'item_id': self.item_id,
            'nome': self.nome,
            'descricao': self.descricao,
            'preco': float(self.preco)
        } 