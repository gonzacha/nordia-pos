import pytest
from fastapi.testclient import TestClient
from typing import Generator
import sys
import os

# Agregar el directorio padre al path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

@pytest.fixture(scope="module")
def client() -> Generator:
    """Cliente de test para la API"""
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture
def sample_product():
    """Producto de ejemplo para tests"""
    return {
        "id": 1,
        "name": "Test Product",
        "price": 100.0,
        "stock": 10,
        "barcode": "1234567890",
        "category": "Test"
    }

@pytest.fixture
def sample_sale():
    """Venta de ejemplo para tests"""
    return {
        "items": [
            {
                "product_id": 1,
                "product_name": "Test Product",
                "quantity": 2,
                "unit_price": 100.0,
                "subtotal": 200.0
            }
        ],
        "total": 200.0,
        "payment_method": "cash",
        "customer_email": "test@test.com"
    }

@pytest.fixture
def sample_payment():
    """Pago de ejemplo para tests"""
    return {
        "amount": 100.0,
        "description": "Test payment",
        "payment_method": "credit_card",
        "customer_email": "test@test.com"
    }

@pytest.fixture(autouse=True)
def reset_database():
    """Reset la base de datos mock antes de cada test"""
    # Aquí resetearías tu base de datos si fuera necesario
    yield
    # Cleanup después del test