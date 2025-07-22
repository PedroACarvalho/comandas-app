import pytest
from unittest.mock import patch

def test_criar_listar_obter_pedido(client):
    # Cria cliente e item
    mesa_num = 3001
    client.post('/api/mesas', json={"numero": mesa_num, "capacidade": 2})
    cliente_resp = client.post('/api/cliente', json={"nome": "ClientePedido", "mesa": mesa_num})
    assert cliente_resp.status_code == 201, cliente_resp.json
    assert 'cliente' in cliente_resp.json, cliente_resp.json
    cliente_id = cliente_resp.json['cliente']['cliente_id']
    item_resp = client.post('/api/itens', json={"nome": "Batata", "preco": 10.0})
    item_id = item_resp.json['item']['item_id']
    # Cria pedido
    pedido_resp = client.post('/api/pedidos', json={"cliente_id": cliente_id, "itens": [{"item_id": item_id, "quantidade": 2}]})
    assert pedido_resp.status_code == 201, pedido_resp.json
    pedido_id = pedido_resp.json['pedido']['pedido_id']
    # Lista pedidos
    resp2 = client.get('/api/pedidos')
    assert resp2.status_code == 200
    assert any(p['pedido_id'] == pedido_id for p in resp2.json['pedidos'])
    # Obter pedido por ID
    resp3 = client.get(f'/api/pedidos/{pedido_id}')
    assert resp3.status_code == 200
    assert resp3.json['pedido']['pedido_id'] == pedido_id

def test_criar_pedido_cliente_inexistente(client):
    resp = client.post('/api/pedidos', json={"cliente_id": 99999, "itens": []})
    assert resp.status_code == 404
    assert 'error' in resp.json

def test_obter_pedido_inexistente(client):
    resp = client.get('/api/pedidos/99999')
    assert resp.status_code == 404
    assert 'error' in resp.json

@patch('events.emitir_pedido_atualizado', lambda *a, **kw: None)
def test_atualizar_status_pedido(client):
    mesa_num = 3002
    client.post('/api/mesas', json={"numero": mesa_num, "capacidade": 2})
    cliente_resp = client.post('/api/cliente', json={"nome": "ClienteStatus", "mesa": mesa_num})
    assert cliente_resp.status_code == 201, cliente_resp.json
    assert 'cliente' in cliente_resp.json, cliente_resp.json
    cliente_id = cliente_resp.json['cliente']['cliente_id']
    item_resp = client.post('/api/itens', json={"nome": "Suco", "preco": 8.0})
    item_id = item_resp.json['item']['item_id']
    pedido_resp = client.post('/api/pedidos', json={"cliente_id": cliente_id, "itens": [{"item_id": item_id, "quantidade": 1}]})
    pedido_id = pedido_resp.json['pedido']['pedido_id']
    resp = client.put(f'/api/pedidos/{pedido_id}/status', json={"status": "Pago"})
    assert resp.status_code == 200, resp.json
    assert resp.json['pedido']['status'].lower() == 'pago'

def test_atualizar_status_pedido_inexistente(client):
    resp = client.put('/api/pedidos/99999/status', json={"status": "Pago"})
    assert resp.status_code == 404
    assert 'error' in resp.json

def test_listar_pedidos_cliente(client):
    mesa_num = 3003
    client.post('/api/mesas', json={"numero": mesa_num, "capacidade": 2})
    cliente_resp = client.post('/api/cliente', json={"nome": "ClienteList", "mesa": mesa_num})
    assert cliente_resp.status_code == 201, cliente_resp.json
    assert 'cliente' in cliente_resp.json, cliente_resp.json
    cliente_id = cliente_resp.json['cliente']['cliente_id']
    item_resp = client.post('/api/itens', json={"nome": "Água", "preco": 3.0})
    item_id = item_resp.json['item']['item_id']
    client.post('/api/pedidos', json={"cliente_id": cliente_id, "itens": [{"item_id": item_id, "quantidade": 1}]})
    resp = client.get(f'/api/pedidos/cliente/{cliente_id}')
    assert resp.status_code == 200
    assert isinstance(resp.json['pedidos'], list)

def test_obter_pedido_ativo_cliente(client):
    mesa_num = 3004
    client.post('/api/mesas', json={"numero": mesa_num, "capacidade": 2})
    cliente_resp = client.post('/api/cliente', json={"nome": "ClienteAtivo", "mesa": mesa_num})
    assert cliente_resp.status_code == 201, cliente_resp.json
    assert 'cliente' in cliente_resp.json, cliente_resp.json
    cliente_id = cliente_resp.json['cliente']['cliente_id']
    item_resp = client.post('/api/itens', json={"nome": "Café", "preco": 4.0})
    item_id = item_resp.json['item']['item_id']
    client.post('/api/pedidos', json={"cliente_id": cliente_id, "itens": [{"item_id": item_id, "quantidade": 1}]})
    resp = client.get(f'/api/pedidos/cliente/{cliente_id}/ativo')
    assert resp.status_code == 200
    assert 'pedido' in resp.json

def test_fechar_pedido(client):
    mesa_num = 3005
    client.post('/api/mesas', json={"numero": mesa_num, "capacidade": 2})
    cliente_resp = client.post('/api/cliente', json={"nome": "ClienteFechar", "mesa": mesa_num})
    assert cliente_resp.status_code == 201, cliente_resp.json
    assert 'cliente' in cliente_resp.json, cliente_resp.json
    cliente_id = cliente_resp.json['cliente']['cliente_id']
    item_resp = client.post('/api/itens', json={"nome": "Bolo", "preco": 7.0})
    item_id = item_resp.json['item']['item_id']
    pedido_resp = client.post('/api/pedidos', json={"cliente_id": cliente_id, "itens": [{"item_id": item_id, "quantidade": 1}]})
    pedido_id = pedido_resp.json['pedido']['pedido_id']
    resp = client.post(f'/api/pedidos/{pedido_id}/fechar')
    assert resp.status_code == 200
    assert 'fechado' in resp.json['message'].lower()

def test_fechar_pedido_inexistente(client):
    resp = client.post('/api/pedidos/99999/fechar')
    assert resp.status_code == 404
    assert 'error' in resp.json 