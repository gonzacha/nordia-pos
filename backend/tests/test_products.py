import pytest
from fastapi.testclient import TestClient

class TestProducts:
    """Tests para el manejo de productos"""

    def test_get_all_products(self, client: TestClient):
        """Test obtener todos los productos"""
        response = client.get("/api/products")
        assert response.status_code == 200
        products = response.json()
        assert isinstance(products, list)
        assert len(products) > 0

        # Verificar estructura del producto
        first_product = products[0]
        assert "id" in first_product
        assert "name" in first_product
        assert "price" in first_product
        assert "stock" in first_product

    def test_get_single_product(self, client: TestClient):
        """Test obtener un producto específico"""
        response = client.get("/api/products/1")
        assert response.status_code == 200
        product = response.json()
        assert product["id"] == 1
        assert "name" in product
        assert "price" in product

    def test_get_nonexistent_product(self, client: TestClient):
        """Test obtener un producto que no existe"""
        response = client.get("/api/products/99999")
        assert response.status_code == 404
        assert response.json()["detail"] == "Producto no encontrado"

    def test_create_product(self, client: TestClient, sample_product):
        """Test crear un nuevo producto"""
        response = client.post("/api/products", json=sample_product)
        assert response.status_code == 200
        created_product = response.json()
        assert "id" in created_product
        assert created_product["name"] == sample_product["name"]
        assert created_product["price"] == sample_product["price"]

    def test_update_product_stock(self, client: TestClient):
        """Test actualizar stock de un producto"""
        new_stock = 50
        response = client.put(f"/api/products/1?stock={new_stock}")
        assert response.status_code == 200
        updated_product = response.json()
        assert updated_product["stock"] == new_stock

    def test_update_nonexistent_product_stock(self, client: TestClient):
        """Test actualizar stock de producto inexistente"""
        response = client.put("/api/products/99999?stock=10")
        assert response.status_code == 404

    @pytest.mark.parametrize("stock_value", [-1, -10, -100])
    def test_negative_stock_validation(self, client: TestClient, stock_value):
        """Test que no se permite stock negativo"""
        # Este test depende de tu lógica de negocio
        # Si permites stock negativo, ajusta el test
        pass