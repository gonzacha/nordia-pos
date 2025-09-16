-- Crear tablas para Nordia POS

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    barcode VARCHAR(50),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    total DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    customer_email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INTEGER REFERENCES sales(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);

-- Insertar productos de ejemplo
INSERT INTO products (name, price, stock, barcode, category) VALUES
    ('Café', 850.00, 100, '7798123456789', 'Bebidas'),
    ('Medialunas', 450.00, 50, '7798123456790', 'Panadería'),
    ('Tostado', 1200.00, 30, '7798123456791', 'Sandwiches'),
    ('Jugo Natural', 600.00, 45, '7798123456792', 'Bebidas'),
    ('Ensalada', 1500.00, 20, '7798123456793', 'Comidas');