import pytest
from unittest.mock import patch

def criar_cliente_pedido_pago(client):
    # Cria mesa, cliente, item, pedido e fecha pedido
    client.post('/api/mesas', json={"numero": 4001, "capacidade": 2})
    cliente_resp = client.post('/api/cliente', json={"nome": "ClientePagto", "mesa": 4001})
    cliente_id = cliente_resp.json['cliente']['cliente_id']
    item_resp = client.post('/api/itens', json={"nome": "Pizza", "preco": 30.0})
    item_id = item_resp.json['item']['item_id']
    pedido_resp = client.post('/api/pedidos', json={"cliente_id": cliente_id, "itens": [{"item_id": item_id, "quantidade": 1}]})
    pedido_id = pedido_resp.json['pedido']['pedido_id']
    # Fecha pedido para permitir pagamento
    client.post(f'/api/pedidos/{pedido_id}/fechar')
    return pedido_id

@patch('events.emitir_pagamento_recebido', lambda *a, **kw: None)
def test_criar_pagamento_dinheiro(client):
    pedido_id = criar_cliente_pedido_pago(client)
    resp = client.post('/api/pagamentos', json={"pedido_id": pedido_id, "metodo": "Dinheiro", "valor": 30.0})
    assert resp.status_code == 201, resp.json
    assert 'pagamento' in resp.json
    assert resp.json['pagamento']['valor'] == 30.0

def test_criar_pagamento_pedido_inexistente(client):
    resp = client.post('/api/pagamentos', json={"pedido_id": 99999, "metodo": "Dinheiro", "valor": 10.0})
    assert resp.status_code == 404
    assert 'error' in resp.json

def test_criar_pagamento_pedido_ja_pago(client):
    pedido_id = criar_cliente_pedido_pago(client)
    client.post('/api/pagamentos', json={"pedido_id": pedido_id, "metodo": "Dinheiro", "valor": 30.0})
    resp = client.post('/api/pagamentos', json={"pedido_id": pedido_id, "metodo": "Dinheiro", "valor": 30.0})
    assert resp.status_code == 400
    assert 'error' in resp.json

def test_criar_pagamento_pedido_nao_fechado(client):
    # Cria pedido mas não fecha
    client.post('/api/mesas', json={"numero": 4002, "capacidade": 2})
    cliente_resp = client.post('/api/cliente', json={"nome": "ClientePagto2", "mesa": 4002})
    cliente_id = cliente_resp.json['cliente']['cliente_id']
    item_resp = client.post('/api/itens', json={"nome": "Suco", "preco": 5.0})
    item_id = item_resp.json['item']['item_id']
    pedido_resp = client.post('/api/pedidos', json={"cliente_id": cliente_id, "itens": [{"item_id": item_id, "quantidade": 1}]})
    pedido_id = pedido_resp.json['pedido']['pedido_id']
    resp = client.post('/api/pagamentos', json={"pedido_id": pedido_id, "metodo": "Dinheiro", "valor": 5.0})
    assert resp.status_code == 400
    assert 'error' in resp.json

def test_obter_pagamento_por_id(client):
    pedido_id = criar_cliente_pedido_pago(client)
    pagto_resp = client.post('/api/pagamentos', json={"pedido_id": pedido_id, "metodo": "Dinheiro", "valor": 30.0})
    pagamento_id = pagto_resp.json['pagamento']['pagamento_id']
    resp = client.get(f'/api/pagamentos/{pagamento_id}')
    assert resp.status_code == 200
    assert resp.json['pagamento']['pagamento_id'] == pagamento_id

def test_obter_pagamento_por_pedido(client):
    pedido_id = criar_cliente_pedido_pago(client)
    client.post('/api/pagamentos', json={"pedido_id": pedido_id, "metodo": "Dinheiro", "valor": 30.0})
    resp = client.get(f'/api/pagamentos/pedido/{pedido_id}')
    assert resp.status_code == 200
    assert resp.json['pagamento']['pedido_id'] == pedido_id

def test_obter_pagamento_inexistente(client):
    resp = client.get('/api/pagamentos/99999')
    assert resp.status_code == 404
    assert 'error' in resp.json 