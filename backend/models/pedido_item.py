from datetime import datetime
from database import db

class PedidoItem(db.Model):
    """Modelo de PedidoItem, representa a associação de um item a um pedido com quantidade."""
    __tablename__ = 'pedido_item'
    
    pedido_id = db.Column(db.Integer, db.ForeignKey('pedido.pedido_id'), primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('item.item_id'), primary_key=True)
    quantidade = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        """Retorna representação legível do item do pedido."""
        return f'<PedidoItem {self.pedido_id}-{self.item_id}>'

    def to_dict(self):
        """Converte o item do pedido para dicionário serializável."""
        return {
            'pedido_id': self.pedido_id,
            'item_id': self.item_id,
            'quantidade': self.quantidade,
            'item': self.item.to_dict() if self.item else None
        } 