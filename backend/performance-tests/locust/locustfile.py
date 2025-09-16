from locust import HttpUser, task, between, TaskSet, events
from locust.contrib.fasthttp import FastHttpUser
import json
import random
from datetime import datetime
import logging
import os

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class POSUserBehavior(TaskSet):
    """Comportamiento típico de un usuario del POS"""

    def on_start(self):
        """Ejecutado cuando un usuario inicia"""
        self.products = self.get_products()
        self.cart = []

    def get_products(self):
        """Obtener lista de productos disponibles"""
        with self.client.get("/api/products", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
                return response.json()
            else:
                response.failure(f"Got status code {response.status_code}")
                return []

    @task(3)
    def view_products(self):
        """Ver lista de productos (peso 3)"""
        with self.client.get("/api/products", name="Get Products", catch_response=True) as response:
            if response.status_code != 200:
                logger.error(f"Failed to get products: {response.status_code}")
                response.failure(f"Got status code {response.status_code}")
            else:
                response.success()

    @task(2)
    def add_to_cart(self):
        """Agregar producto al carrito (peso 2)"""
        if not self.products:
            return

        product = random.choice(self.products)
        quantity = random.randint(1, 3)
        self.cart.append({
            "product_id": product["id"],
            "product_name": product["name"],
            "quantity": quantity,
            "unit_price": product["price"],
            "subtotal": product["price"] * quantity
        })

        # Simular actualización de UI
        self.client.get(f"/api/products/{product['id']}", name="Get Single Product")

    @task(1)
    def complete_sale(self):
        """Completar una venta (peso 1)"""
        if not self.cart:
            self.add_to_cart()

        sale_data = {
            "items": self.cart,
            "total": sum(item["subtotal"] for item in self.cart),
            "payment_method": random.choice(["cash", "card", "mercadopago"]),
            "customer_email": f"customer_{random.randint(1, 1000)}@test.com"
        }

        with self.client.post(
            "/api/sales",
            json=sale_data,
            catch_response=True,
            name="Create Sale"
        ) as response:
            if response.status_code == 200:
                response.success()
                self.cart = []  # Limpiar carrito después de venta exitosa

                # Verificar que el stock se actualizó
                product_id = sale_data["items"][0]["product_id"]
                self.client.get(f"/api/products/{product_id}", name="Verify Stock Update")
            else:
                response.failure(f"Sale failed: {response.text}")

    @task(1)
    def process_payment(self):
        """Procesar pago con MercadoPago"""
        payment_data = {
            "amount": random.uniform(100, 5000),
            "description": f"Test payment {datetime.now()}",
            "payment_method": "credit_card",
            "customer_email": f"test_{random.randint(1, 1000)}@test.com"
        }

        with self.client.post(
            "/api/payments/process",
            json=payment_data,
            name="Process Payment",
            catch_response=True
        ) as response:
            if response.status_code != 200:
                logger.error(f"Payment failed: {response.text}")
                response.failure(f"Payment failed: {response.text}")
            else:
                response.success()

    @task(1)
    def get_statistics(self):
        """Obtener estadísticas del día"""
        self.client.get("/api/stats/today", name="Get Statistics")

class NormalUser(FastHttpUser):
    """Usuario normal del POS"""
    wait_time = between(1, 5)  # Espera entre 1 y 5 segundos entre tareas
    tasks = [POSUserBehavior]

class PowerUser(FastHttpUser):
    """Usuario avanzado (más rápido)"""
    wait_time = between(0.5, 2)
    tasks = [POSUserBehavior]

class MobileUser(FastHttpUser):
    """Usuario móvil (más lento)"""
    wait_time = between(2, 8)
    tasks = [POSUserBehavior]

# Eventos para métricas personalizadas
@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    logger.info("Performance test started")

@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    logger.info("Performance test completed")

    # Calcular métricas personalizadas
    total_requests = sum(stats.num_requests for stats in environment.stats.entries.values())
    failure_rate = environment.stats.total.fail_ratio

    logger.info(f"Total requests: {total_requests}")
    logger.info(f"Failure rate: {failure_rate:.2%}")

    # Crear directorio de resultados si no existe
    os.makedirs("results", exist_ok=True)

    # Guardar resultados
    results_data = {
        "total_requests": total_requests,
        "failure_rate": failure_rate,
        "response_times": {
            "min": environment.stats.total.min_response_time,
            "max": environment.stats.total.max_response_time,
            "median": environment.stats.total.median_response_time,
            "average": environment.stats.total.avg_response_time,
            "p95": environment.stats.total.get_response_time_percentile(0.95),
            "p99": environment.stats.total.get_response_time_percentile(0.99)
        }
    }

    with open("results/locust_results.json", "w") as f:
        json.dump(results_data, f, indent=2)