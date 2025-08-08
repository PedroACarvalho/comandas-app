"""
Script utilitário para inicializar o banco de dados do sistema de comandas.
Execute com o contexto da aplicação Flask.
"""

from app import app
from database import init_db


def inicializar_banco():
    """Inicializa o banco de dados e exibe mensagens de status."""
    print("Inicializando o banco de dados...")
    init_db()
    print("Banco de dados inicializado com sucesso!")


if __name__ == "__main__":
    with app.app_context():
        inicializar_banco()
