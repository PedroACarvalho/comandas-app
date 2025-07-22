import pytest

def test_listar_mesas_disponiveis(client):
    resp = client.get('/api/mesas/disponiveis')
    assert resp.status_code == 200
    assert 'mesas_disponiveis' in resp.json

def test_criar_cliente_faltando_dados(client):
    resp = client.post('/api/cliente', json={})
    assert resp.status_code == 400
    assert 'error' in resp.json

def test_criar_e_obter_cliente(client):
    # Cria cliente em mesa 99
    resp = client.post('/api/cliente', json={"nome": "Teste", "mesa": 99})
    assert resp.status_code == 201
    cliente_id = resp.json['cliente']['cliente_id']
    # Busca cliente pela mesa
    resp2 = client.get('/api/cliente/99')
    assert resp2.status_code == 200
    assert resp2.json['cliente']['nome'] == "Teste"
    # Remove cliente
    resp3 = client.delete(f'/api/cliente/{cliente_id}')
    assert resp3.status_code == 200
    assert 'removido' in resp3.json['message']

def test_obter_cliente_inexistente(client):
    resp = client.get('/api/cliente/99999')
    assert resp.status_code == 404
    assert 'error' in resp.json

def test_remover_cliente_inexistente(client):
    resp = client.delete('/api/cliente/99999')
    assert resp.status_code == 404
    assert 'error' in resp.json 