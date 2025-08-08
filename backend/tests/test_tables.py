import pytest


def test_criar_listar_editar_deletar_mesa(client):
    # Cria mesa
    resp = client.post("/api/mesas", json={"numero": 123, "capacidade": 4})
    assert resp.status_code == 201
    mesa_id = (
        resp.json["mesa_id"] if "mesa_id" in resp.json else resp.json.get("id", None)
    )
    # Lista mesas
    resp2 = client.get("/api/mesas")
    assert resp2.status_code == 200
    assert any(m["numero"] == 123 for m in resp2.json)
    # Edita mesa
    resp3 = client.put(f"/api/mesas/{mesa_id}", json={"numero": 124, "capacidade": 6})
    assert resp3.status_code == 200
    assert resp3.json["numero"] == 124
    # Deleta mesa
    resp4 = client.delete(f"/api/mesas/{mesa_id}")
    assert resp4.status_code == 200
    assert "deletada" in resp4.json["message"]


def test_criar_mesa_dados_invalidos(client):
    resp = client.post("/api/mesas", json={})
    assert resp.status_code == 400
    assert "error" in resp.json


def test_criar_mesa_duplicada(client):
    client.post("/api/mesas", json={"numero": 200, "capacidade": 2})
    resp = client.post("/api/mesas", json={"numero": 200, "capacidade": 2})
    assert resp.status_code == 400
    assert "já existe" in resp.json["error"].lower()


def test_obter_mesa_inexistente(client):
    resp = client.get("/api/mesas/99999")
    assert resp.status_code == 404
    assert "error" in resp.json


def test_editar_mesa_inexistente(client):
    resp = client.put("/api/mesas/99999", json={"numero": 1, "capacidade": 1})
    assert resp.status_code == 404
    assert "error" in resp.json


def test_deletar_mesa_inexistente(client):
    resp = client.delete("/api/mesas/99999")
    assert resp.status_code == 404
    assert "error" in resp.json
