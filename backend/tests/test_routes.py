import pytest


def test_hello(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json["message"] == "API de Comandas Online funcionando!"
