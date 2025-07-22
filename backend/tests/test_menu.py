import pytest

def test_criar_listar_atualizar_remover_item(client):
    # Cria item
    resp = client.post('/api/itens', json={"nome": "Coca-Cola", "preco": 5.0})
    assert resp.status_code == 201
    item_id = resp.json['item']['item_id'] if 'item' in resp.json and 'item_id' in resp.json['item'] else resp.json['item'].get('id', None)
    # Lista itens
    resp2 = client.get('/api/itens')
    assert resp2.status_code == 200
    assert any(i['nome'] == "Coca-Cola" for i in resp2.json['itens'])
    # Atualiza item
    resp3 = client.put(f'/api/itens/{item_id}', json={"nome": "Coca Zero", "preco": 6.0})
    assert resp3.status_code == 200
    assert resp3.json['item']['nome'] == "Coca Zero"
    # Remove item
    resp4 = client.delete(f'/api/itens/{item_id}')
    assert resp4.status_code == 200
    assert 'removido' in resp4.json['message']

def test_criar_item_dados_invalidos(client):
    resp = client.post('/api/itens', json={})
    assert resp.status_code == 400
    assert 'error' in resp.json

def test_obter_item_inexistente(client):
    resp = client.get('/api/itens/99999')
    assert resp.status_code == 404
    assert 'error' in resp.json

def test_atualizar_item_inexistente(client):
    resp = client.put('/api/itens/99999', json={"nome": "Teste", "preco": 1.0})
    assert resp.status_code == 404
    assert 'error' in resp.json

def test_remover_item_inexistente(client):
    resp = client.delete('/api/itens/99999')
    assert resp.status_code == 404
    assert 'error' in resp.json 