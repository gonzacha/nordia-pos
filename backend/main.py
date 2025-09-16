from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import mercadopago
import os
from jose import JWTError, jwt
import uvicorn

# Configuración
app = FastAPI(
    title="Nordia POS API",
    description="API para el sistema de punto de venta Nordia",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MercadoPago SDK
mp = mercadopago.SDK(os.getenv("MERCADOPAGO_ACCESS_TOKEN", "TEST-TOKEN"))

# ========================
# Modelos Pydantic
# ========================

class Product(BaseModel):
    id: int
    name: str
    price: float
    stock: int
    barcode: Optional[str] = None
    category: Optional[str] = None

class SaleItem(BaseModel):
    product_id: int
    product_name: str
    quantity: int
    unit_price: float
    subtotal: float

class Sale(BaseModel):
    id: Optional[int] = None
    items: List[SaleItem]
    total: float
    payment_method: str
    customer_email: Optional[str] = None
    status: str = "pending"
    created_at: Optional[datetime] = None

class PaymentRequest(BaseModel):
    amount: float
    description: str
    payment_method: str = "credit_card"
    customer_email: str = "customer@nordia.com"

# ========================
# Base de Datos (Mock)
# ========================

# Mock database
products_db = [
    {"id": 1, "name": "Café", "price": 850, "stock": 100, "barcode": "7798123456789", "category": "Bebidas"},
    {"id": 2, "name": "Medialunas", "price": 450, "stock": 50, "barcode": "7798123456790", "category": "Panadería"},
    {"id": 3, "name": "Tostado", "price": 1200, "stock": 30, "barcode": "7798123456791", "category": "Sandwiches"},
    {"id": 4, "name": "Jugo Natural", "price": 600, "stock": 45, "barcode": "7798123456792", "category": "Bebidas"},
    {"id": 5, "name": "Ensalada", "price": 1500, "stock": 20, "barcode": "7798123456793", "category": "Comidas"},
]

sales_db = []

# ========================
# Endpoints
# ========================

@app.get("/")
def root():
    return {
        "name": "Nordia POS API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "products": "/api/products",
            "sales": "/api/sales"
        }
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(),
        "service": "nordia-pos-backend"
    }

# ---- Products ----

@app.get("/api/products", response_model=List[Product])
def get_products():
    """Obtener lista de todos los productos"""
    return products_db

@app.get("/api/products/{product_id}")
def get_product(product_id: int):
    """Obtener un producto por ID"""
    product = next((p for p in products_db if p["id"] == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return product

@app.post("/api/products")
def create_product(product: Product):
    """Crear un nuevo producto"""
    new_product = product.model_dump()
    new_product["id"] = len(products_db) + 1
    products_db.append(new_product)
    return new_product

@app.put("/api/products/{product_id}")
def update_stock(product_id: int, stock: int):
    """Actualizar stock de un producto"""
    product = next((p for p in products_db if p["id"] == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    product["stock"] = stock
    return product

# ---- Sales ----

@app.post("/api/sales")
def create_sale(sale: Sale):
    """Crear una nueva venta"""
    # Verificar stock
    for item in sale.items:
        product = next((p for p in products_db if p["id"] == item.product_id), None)
        if not product:
            raise HTTPException(
                status_code=400,
                detail=f"Producto {item.product_id} no encontrado"
            )
        if product["stock"] < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Stock insuficiente para {product['name']}"
            )

    # Actualizar stock
    for item in sale.items:
        product = next(p for p in products_db if p["id"] == item.product_id)
        product["stock"] -= item.quantity

    # Guardar venta
    new_sale = sale.model_dump()
    new_sale["id"] = len(sales_db) + 1
    new_sale["created_at"] = datetime.now()
    new_sale["status"] = "completed"
    sales_db.append(new_sale)

    return {
        "sale_id": new_sale["id"],
        "total": new_sale["total"],
        "status": new_sale["status"],
        "message": "Venta procesada exitosamente"
    }

@app.get("/api/sales")
def get_sales():
    """Obtener todas las ventas"""
    return sales_db

@app.get("/api/sales/{sale_id}")
def get_sale(sale_id: int):
    """Obtener una venta por ID"""
    sale = next((s for s in sales_db if s["id"] == sale_id), None)
    if not sale:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    return sale

# ---- Payments (MercadoPago) ----

@app.post("/api/payments/process")
def process_payment(payment: PaymentRequest):
    """Procesar pago con MercadoPago"""
    try:
        payment_data = {
            "transaction_amount": payment.amount,
            "description": payment.description,
            "payment_method_id": "master",
            "payer": {
                "email": payment.customer_email
            },
            "external_reference": f"nordia_pos_{datetime.now().timestamp()}"
        }

        # En desarrollo, simular respuesta exitosa
        if os.getenv("ENVIRONMENT", "development") == "development":
            return {
                "success": True,
                "payment_id": f"DEMO-{datetime.now().timestamp()}",
                "status": "approved",
                "amount": payment.amount,
                "message": "Pago simulado exitoso (modo desarrollo)"
            }

        # En producción, usar MercadoPago real
        payment_response = mp.payment().create(payment_data)

        if payment_response["status"] == 201:
            return {
                "success": True,
                "payment_id": payment_response["response"]["id"],
                "status": payment_response["response"]["status"],
                "amount": payment.amount
            }
        else:
            return {
                "success": False,
                "error": payment_response["response"]
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/payments/qr")
def create_qr_payment(amount: float, description: str):
    """Crear QR para pago con MercadoPago"""
    try:
        preference_data = {
            "items": [
                {
                    "title": description,
                    "quantity": 1,
                    "unit_price": amount
                }
            ],
            "back_urls": {
                "success": "http://localhost:3000/success",
                "failure": "http://localhost:3000/failure",
                "pending": "http://localhost:3000/pending"
            },
            "auto_return": "approved",
        }

        # En desarrollo, retornar QR demo
        if os.getenv("ENVIRONMENT", "development") == "development":
            return {
                "success": True,
                "qr_code": "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=DEMO-QR",
                "amount": amount
            }

        preference_response = mp.preference().create(preference_data)

        if preference_response["status"] == 201:
            return {
                "success": True,
                "preference_id": preference_response["response"]["id"],
                "qr_code": preference_response["response"]["init_point"],
                "amount": amount
            }
        else:
            return {
                "success": False,
                "error": preference_response["response"]
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---- Statistics ----

@app.get("/api/stats/today")
def get_today_stats():
    """Obtener estadísticas del día"""
    today = datetime.now().date()
    today_sales = [s for s in sales_db if s.get("created_at") and s["created_at"].date() == today]

    total_sales = len(today_sales)
    total_revenue = sum(s["total"] for s in today_sales)

    return {
        "date": today,
        "total_sales": total_sales,
        "total_revenue": total_revenue,
        "average_ticket": total_revenue / total_sales if total_sales > 0 else 0
    }

# ========================
# Main
# ========================

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("API_PORT", 8000)),
        reload=True
    )