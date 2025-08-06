import sys
import os

# Adicionar o diretório atual ao path para que os imports funcionem
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from flask_migrate import Migrate

app = create_app()
migrate = Migrate(app, db)


if __name__ == "__main__":
    app.run()
