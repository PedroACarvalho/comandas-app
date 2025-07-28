#!/usr/bin/env python3
"""
Script para corrigir automaticamente problemas de linting
"""
import os
import re

def fix_file(filepath):
    """Corrige problemas de linting em um arquivo"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Corrigir espaços em branco no final das linhas
        content = re.sub(r'[ \t]+$', '', content, flags=re.MULTILINE)
        
        # Adicionar quebra de linha no final se não existir
        if not content.endswith('\n'):
            content += '\n'
        
        # Corrigir linhas em branco com espaços
        content = re.sub(r'^\s+$', '', content, flags=re.MULTILINE)
        
        # Remover linhas duplicadas em branco
        content = re.sub(r'\n\n\n+', '\n\n', content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Corrigido: {filepath}")
        
    except Exception as e:
        print(f"❌ Erro ao corrigir {filepath}: {e}")

def main():
    """Função principal"""
    # Lista de arquivos Python para corrigir
    python_files = [
        '__init__.py',
        'app.py',
        'clean_db.py',
        'database.py',
        'events.py',
        'init_db_script.py',
        'models/__init__.py',
        'models/cliente.py',
        'models/item.py',
        'models/mesa.py',
        'models/pagamento.py',
        'models/pedido.py',
        'models/pedido_item.py',
        'routes/__init__.py',
        'routes/auth.py',
        'routes/menu.py',
        'routes/orders.py',
        'routes/payment.py',
        'routes/tables.py',
        'tests/conftest.py',
        'tests/test_auth.py',
        'tests/test_menu.py',
        'tests/test_orders.py',
        'tests/test_payments.py',
        'tests/test_routes.py',
        'tests/test_tables.py'
    ]
    
    for filepath in python_files:
        if os.path.exists(filepath):
            fix_file(filepath)
        else:
            print(f"⚠️  Arquivo não encontrado: {filepath}")

if __name__ == '__main__':
    main() 