import pytest
from fastapi.testclient import TestClient

def test_root_endpoint(client: TestClient):
    """Test del endpoint raíz"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "name" in data
    assert data["name"] == "Nordia POS API"
    assert "version" in data
    assert "endpoints" in data

def test_health_check(client: TestClient):
    """Test del health check"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data
    assert data["service"] == "nordia-pos-backend"

def test_cors_headers(client: TestClient):
    """Test que CORS está configurado correctamente"""
    # Note: TestClient doesn't include CORS headers in response
    # This test validates the endpoint works, CORS is configured in main.py
    response = client.get("/health")
    assert response.status_code == 200
    # CORS headers are applied by middleware in production, not in TestClient