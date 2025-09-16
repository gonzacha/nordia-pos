import pytest
from fastapi.testclient import TestClient
import json

class TestSales:
    """Tests para el manejo de ventas"""

    def test_create_sale_success(self, client: TestClient):
        """Test crear una venta exitosa"""
        sample_sale = {
            "items": [{
                "product_id": 1,
                "product_name": "Café",
                "quantity": 1,
                "unit_price": 850,
                "subtotal": 850
            }],
            "total": 850,
            "payment_method": "cash"
        }
        response = client.post("/api/sales", json=sample_sale)
        assert response.status_code == 200
        sale_response = response.json()
        assert "sale_id" in sale_response
        assert sale_response["status"] == "completed"
        assert sale_response["total"] == sample_sale["total"]

    def test_create_sale_insufficient_stock(self, client: TestClient):
        """Test crear venta con stock insuficiente"""
        sale_data = {
            "items": [{
                "product_id": 1,
                "product_name": "Café",
                "quantity": 9999,  # Más que el stock disponible
                "unit_price": 850,
                "subtotal": 850 * 9999
            }],
            "total": 850 * 9999,
            "payment_method": "cash"
        }
        response = client.post("/api/sales", json=sale_data)
        assert response.status_code == 400
        assert "Stock insuficiente" in response.json()["detail"]

    def test_create_sale_nonexistent_product(self, client: TestClient):
        """Test crear venta con producto inexistente"""
        sale_data = {
            "items": [{
                "product_id": 99999,
                "product_name": "Producto Inexistente",
                "quantity": 1,
                "unit_price": 100,
                "subtotal": 100
            }],
            "total": 100,
            "payment_method": "cash"
        }
        response = client.post("/api/sales", json=sale_data)
        assert response.status_code == 400
        assert "no encontrado" in response.json()["detail"]

    def test_get_all_sales(self, client: TestClient):
        """Test obtener todas las ventas"""
        # Primero crear una venta
        sample_sale = {
            "items": [{
                "product_id": 1,
                "product_name": "Café",
                "quantity": 1,
                "unit_price": 850,
                "subtotal": 850
            }],
            "total": 850,
            "payment_method": "cash"
        }
        client.post("/api/sales", json=sample_sale)

        # Luego obtener todas las ventas
        response = client.get("/api/sales")
        assert response.status_code == 200
        sales = response.json()
        assert isinstance(sales, list)

    def test_sale_stock_update(self, client: TestClient):
        """Test que el stock se actualiza después de una venta"""
        # Obtener stock inicial
        product_response = client.get("/api/products/1")
        initial_stock = product_response.json()["stock"]

        # Crear venta
        sale_data = {
            "items": [{
                "product_id": 1,
                "product_name": "Café",
                "quantity": 2,
                "unit_price": 850,
                "subtotal": 1700
            }],
            "total": 1700,
            "payment_method": "cash"
        }
        client.post("/api/sales", json=sale_data)

        # Verificar stock actualizado
        product_response = client.get("/api/products/1")
        new_stock = product_response.json()["stock"]
        assert new_stock == initial_stock - 2

    @pytest.mark.parametrize("payment_method", ["cash", "card", "mercadopago"])
    def test_different_payment_methods(self, client: TestClient, payment_method):
        """Test ventas con diferentes métodos de pago"""
        sale_data = {
            "items": [{
                "product_id": 1,
                "product_name": "Café",
                "quantity": 1,
                "unit_price": 850,
                "subtotal": 850
            }],
            "total": 850,
            "payment_method": payment_method
        }
        response = client.post("/api/sales", json=sale_data)
        assert response.status_code == 200
        assert response.json()["status"] == "completed"