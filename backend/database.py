try:
    from flask_sqlalchemy import SQLAlchemy
    from flask_migrate import Migrate
except ImportError as e:
    raise ImportError("Required packages for database are not installed. Please install flask_sqlalchemy and flask_migrate.") from e

db = SQLAlchemy()
migrate = Migrate()

def init_db():
    """
    Inicializa o banco de dados criando todas as tabelas e populando com dados de exemplo se necessário.
    - Remove e recria todas as tabelas (drop_all + create_all).
    - Insere itens e mesas de exemplo se não existirem.
    """
    from models import Cliente, Pedido, Item, PedidoItem, Pagamento, Mesa
    db.drop_all()
    db.create_all()
    _inserir_itens_exemplo()
    _inserir_mesas_exemplo()

def _inserir_itens_exemplo():
    """Insere itens de exemplo no banco se não existirem."""
    from models import Item
    if not Item.query.first():
        itens_exemplo = [
            Item(nome='X-Burger', descricao='Hambúrguer com queijo e salada', preco=15.90),
            Item(nome='X-Salada', descricao='Hambúrguer com queijo, salada e tomate', preco=17.90),
            Item(nome='Refrigerante', descricao='Coca-Cola 350ml', preco=6.50),
            Item(nome='Batata Frita', descricao='Porção de batata frita', preco=12.90),
            Item(nome='Sorvete', descricao='Sorvete de chocolate', preco=8.50)
        ]
        for item in itens_exemplo:
            db.session.add(item)
        db.session.commit()

def _inserir_mesas_exemplo():
    """Insere mesas de exemplo no banco se não existirem."""
    from models import Mesa
    if not Mesa.query.first():
        mesas_exemplo = [
            Mesa(numero=1, capacidade=4),
            Mesa(numero=2, capacidade=2),
            Mesa(numero=3, capacidade=6)
        ]
        for mesa in mesas_exemplo:
            db.session.add(mesa)
        db.session.commit()