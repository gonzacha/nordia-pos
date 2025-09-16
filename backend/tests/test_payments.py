import pytest
from fastapi.testclient import TestClient
import os

class TestPayments:
    """Tests para el procesamiento de pagos"""

    def test_process_payment_development_mode(self, client: TestClient, sample_payment):
        """Test procesar pago en modo desarrollo"""
        # Asegurar que estamos en modo desarrollo
        os.environ["ENVIRONMENT"] = "development"

        response = client.post("/api/payments/process", json=sample_payment)
        assert response.status_code == 200
        payment_response = response.json()
        assert payment_response["success"] == True
        assert "DEMO" in payment_response["payment_id"]
        assert payment_response["status"] == "approved"
        assert "simulado" in payment_response["message"]

    def test_create_qr_payment(self, client: TestClient):
        """Test crear QR de pago"""
        os.environ["ENVIRONMENT"] = "development"

        response = client.post("/api/payments/qr?amount=1000&description=Test+QR")
        assert response.status_code == 200
        qr_response = response.json()
        assert qr_response["success"] == True
        assert "qr_code" in qr_response
        assert qr_response["amount"] == 1000

    @pytest.mark.parametrize("amount", [0.01, 1, 100, 1000, 99999.99])
    def test_different_payment_amounts(self, client: TestClient, amount):
        """Test pagos con diferentes montos"""
        payment_data = {
            "amount": amount,
            "description": f"Test payment ${amount}",
            "payment_method": "credit_card",
            "customer_email": "test@test.com"
        }
        response = client.post("/api/payments/process", json=payment_data)
        assert response.status_code == 200
        assert response.json()["amount"] == amount