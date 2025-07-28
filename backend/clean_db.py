"""
Script utilitário para limpar o banco de dados: remove todos os pedidos e clientes e libera todas as mesas.
Execute com o contexto da aplicação Flask.
"""

def limpar_banco():
    """Remove todos os pedidos e clientes e libera todas as mesas."""
    from models.pedido import Pedido
    from models.cliente import Cliente
    from models.mesa import Mesa
    print('Removendo todos os pedidos e clientes...')
    Pedido.query.delete()
    Cliente.query.delete()
    mesas = Mesa.query.all()
    for mesa in mesas:
        mesa.status = 'livre'
    db.session.commit()
    print('Pedidos e clientes removidos e mesas liberadas com sucesso!')

if __name__ == '__main__':
    from app import app
    from database import db
    with app.app_context():
        limpar_banco()
