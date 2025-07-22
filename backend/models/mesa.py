from database import db

class Mesa(db.Model):
    """Modelo de Mesa, representa uma mesa do estabelecimento."""
    __tablename__ = 'mesa'

    mesa_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    numero = db.Column(db.Integer, nullable=False, unique=True)
    capacidade = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='livre')

    def __repr__(self):
        """Retorna representação legível da mesa."""
        return f'<Mesa {self.numero}>'

    def to_dict(self):
        """Converte a mesa para dicionário serializável."""
        return {
            'mesa_id': self.mesa_id,
            'numero': self.numero,
            'capacidade': self.capacidade,
            'status': self.status
        } 