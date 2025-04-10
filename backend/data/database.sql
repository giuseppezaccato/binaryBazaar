-- Tabella: brands
CREATE TABLE brands (
    brand_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

-- Tabella: promotions
CREATE TABLE promotions (
    promotion_id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(255) NOT NULL,
    discount DECIMAL(10,2) NOT NULL,
    valid_from DATE,
    valid_to DATE
);

-- Tabella: products
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,          -- Nome del prodotto
    model VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,     -- Per URL friendly
    brand_id INT,
    category ENUM('laptop','accessory') NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2),          -- Prezzo scontato, se applicabile
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stock INT NOT NULL,
    description TEXT,
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id)
);

-- Tabella: laptop_details
CREATE TABLE laptop_details (
    laptop_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    processor VARCHAR(255),
    ram TINYINT,                         -- Quantità in GB (es. 8, 16)
    memory SMALLINT,                     -- Capacità in GB/SSD-HDD
    video_card VARCHAR(255),
    os VARCHAR(255),
    year YEAR,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Tabella: accessory_details
CREATE TABLE accessory_details (
    accessory_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    type VARCHAR(255),                   -- Tipo di accessorio (es. mouse, keyboard)
    compatibility VARCHAR(255),          -- Compatibilità con i sistemi operativi
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Tabella: orders
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,          -- Nome del cliente
    lastname VARCHAR(255) NOT NULL,        -- Cognome del cliente
    email VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    telephone VARCHAR(255),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    promotion_id INT,
    FOREIGN KEY (promotion_id) REFERENCES promotions(promotion_id)
);

-- Tabella: product_order
CREATE TABLE product_order (
    product_order_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,               -- Quantità ordinata
    price DECIMAL(10,2) NOT NULL,         -- Prezzo al momento dell’ordine
    name VARCHAR(255) NOT NULL,           -- Nome del prodotto all’atto dell’ordine
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);


-- Inserimento Brand
INSERT INTO brands (name) VALUES
('Apple'), ('Dell'), ('HP'), ('Asus'), ('MSI'),
('Lenovo'), ('Acer'), ('Samsung'), ('Sony'), ('Logitech');

-- Inserimento Promozioni
INSERT INTO promotions (code, discount, valid_from, valid_to) VALUES
('SUMMER25', 25.00, '2025-06-01', '2025-08-31'),
('WELCOME10', 10.00, '2025-01-01', '2025-12-31');

-- inserimento PROMO nuove da GAMEDISCOUNT
INSERT INTO promotions (code, discount, valid_from, valid_to) VALUES
('LORIS10', 10.00, '2025-04-02', '2025-04-30'),
('ARTUR30', 30.00, '2025-04-01', '2025-04-30');


-- Inserimento Prodotti (Laptop, con discount_price)
INSERT INTO products (slug, brand_id, category, name, model, price, discount_price, image_url, created_at, stock, description) VALUES
('macbook-air-m2', 1, 'laptop', 'MacBook Air M2', 'A2681', 1299.99, 1169.99, NULL, CURRENT_TIMESTAMP, 20, 'Laptop leggero con chip M2'),
('dell-xps-15', 2, 'laptop', 'Dell XPS 15', '9520', 1799.99, NULL, NULL, CURRENT_TIMESTAMP, 15, 'Laptop con display 4K'),
('hp-spectre-x360', 3, 'laptop', 'HP Spectre x360', '14-EA0023DX', 1599.99, NULL, NULL, CURRENT_TIMESTAMP, 18, 'Laptop convertibile premium'),
('asus-rog-zephyrus', 4, 'laptop', 'Asus ROG Zephyrus', 'G14-GA402', 1999.99, 1799.99, NULL, CURRENT_TIMESTAMP, 12, 'Laptop gaming sottile'),
('msi-stealth-15m', 5, 'laptop', 'MSI Stealth 15M', 'B12U', 1699.99, NULL, NULL, CURRENT_TIMESTAMP, 10, 'Laptop gaming portatile'),
('lenovo-thinkpad-x1', 6, 'laptop', 'Lenovo ThinkPad X1 Carbon', '20U9', 1899.99, NULL, NULL, CURRENT_TIMESTAMP, 14, 'Laptop business ultraleggero'),
('acer-swift-5', 7, 'laptop', 'Acer Swift 5', 'SF514-55T', 1199.99, NULL, NULL, CURRENT_TIMESTAMP, 25, 'Laptop con design elegante'),
('samsung-galaxy-book', 8, 'laptop', 'Samsung Galaxy Book Pro', 'NP950XDB', 1399.99, NULL, NULL, CURRENT_TIMESTAMP, 20, 'Laptop con AMOLED'),
('sony-vaio-sx14', 9, 'laptop', 'Sony VAIO SX14', 'VJS141', 2099.99, NULL, NULL, CURRENT_TIMESTAMP, 8, 'Laptop premium compatto'),
('logitech-creator-laptop', 10, 'laptop', 'Logitech Creator Laptop', 'LC-2023', 1499.99, NULL, NULL, CURRENT_TIMESTAMP, 15, 'Laptop per creativi');

-- Inserimento Dettagli Laptop
INSERT INTO laptop_details (product_id, processor, ram, memory, video_card, os, year) VALUES
(1, 'Apple M2', 8, 256, 'Integrated', 'macOS', 2023), -- MacBook Air M2
(2, 'Intel i7', 16, 512, 'NVIDIA RTX 3050', 'Windows 11', 2023), -- Dell XPS 15
(3, 'Intel i7', 16, 512, 'Integrated', 'Windows 11', 2023), -- HP Spectre x360
(4, 'AMD Ryzen 9', 32, 1000, 'NVIDIA RTX 3060', 'Windows 11', 2023), -- Asus ROG Zephyrus
(5, 'Intel i7', 16, 512, 'NVIDIA RTX 3050', 'Windows 11', 2023), -- MSI Stealth 15M
(6, 'Intel i7', 16, 512, 'Integrated', 'Windows 11', 2023), -- Lenovo ThinkPad X1 Carbon
(7, 'Intel i5', 8, 256, 'Integrated', 'Windows 11', 2023), -- Acer Swift 5
(8, 'Intel i7', 16, 512, 'Integrated', 'Windows 11', 2023), -- Samsung Galaxy Book Pro
(9, 'Intel i7', 16, 512, 'Integrated', 'Windows 11', 2023), -- Sony VAIO SX14
(10, 'Intel i7', 16, 1000, 'NVIDIA RTX 3050', 'Windows 11', 2023); -- Logitech Creator Laptop

-- Inserimento Prodotti (Accessori, con discount_price)
INSERT INTO products (slug, brand_id, category, name, model, price, discount_price, image_url, created_at, stock, description) VALUES
('apple-magic-mouse', 1, 'accessory', 'Apple Magic Mouse', 'MK2E3ZM/A', 99.99, NULL, NULL, CURRENT_TIMESTAMP, 50, 'Mouse multi-touch'),
('dell-wireless-keyboard', 2, 'accessory', 'Dell Wireless Keyboard', 'KB700', 59.99, NULL, NULL, CURRENT_TIMESTAMP, 40, 'Tastiera wireless silenziosa'),
('hp-usb-c-hub', 3, 'accessory', 'HP USB-C Hub', '4M1F3AA', 79.99, NULL, NULL, CURRENT_TIMESTAMP, 35, 'Hub multiporta USB-C'),
('asus-rog-mouse-pad', 4, 'accessory', 'Asus ROG Mouse Pad', 'ROG-SHEATH', 29.99, NULL, NULL, CURRENT_TIMESTAMP, 60, 'Tappetino gaming XL'),
('msi-gaming-headset', 5, 'accessory', 'MSI Gaming Headset', 'H991', 89.99, NULL, NULL, CURRENT_TIMESTAMP, 30, 'Cuffie con microfono'),
('lenovo-docking-station', 6, 'accessory', 'Lenovo Docking Station', '40AY0090', 129.99, NULL, NULL, CURRENT_TIMESTAMP, 25, 'Dock per laptop ThinkPad'),
('acer-laptop-sleeve', 7, 'accessory', 'Acer Laptop Sleeve', 'NP.BAG1A.291', 39.99, NULL, NULL, CURRENT_TIMESTAMP, 45, 'Custodia protettiva 15"'),
('samsung-ssd-external', 8, 'accessory', 'Samsung SSD External', 'MU-PC1T0', 149.99, NULL, NULL, CURRENT_TIMESTAMP, 20, 'SSD portatile 1TB'),
('sony-wh-1000xm5', 9, 'accessory', 'Sony WH-1000XM5', 'WH1000XM5', 349.99, 314.99, NULL, CURRENT_TIMESTAMP, 15, 'Cuffie noise-cancelling'),
('logitech-mx-master-3', 10, 'accessory', 'Logitech MX Master 3', '910-005620', 109.99, NULL, NULL, CURRENT_TIMESTAMP, 30, 'Mouse ergonomico avanzato');

-- Inserimento Dettagli Accessori
INSERT INTO accessory_details (product_id, type, compatibility) VALUES
(11, 'Mouse', 'macOS, Windows'), -- Apple Magic Mouse 
(12, 'Keyboard', 'Windows'), -- Dell Wireless Keyboard

-- aggiunti solo dopo, integrare questo codice!!!
-- INSERT INTO accessory_details (product_id, type, compatibility) VALUES
-- (11, 'Mouse', 'macOS, Windows'), -- Apple Magic Mouse
-- (12, 'Keyboard', 'Windows'); -- Dell Wireless Keyboard

(13, 'Hub', 'Windows, macOS, Linux'), -- HP USB-C Hub
(14, 'Mouse Pad', 'Universale'), -- Asus ROG Mouse Pad
(15, 'Headset', 'Windows, macOS, PS4, Xbox'), -- MSI Gaming Headset
(16, 'Docking Station', 'Windows, macOS (ThinkPad compatibile)'), -- Lenovo Docking Station
(17, 'Sleeve', 'Universale (fino a 15")'), -- Acer Laptop Sleeve
(18, 'SSD External', 'Windows, macOS, Linux'), -- Samsung SSD External
(19, 'Headphones', 'Bluetooth, Windows, macOS, Android, iOS'), -- Sony WH-1000XM5
(20, 'Mouse', 'Windows, macOS, Linux'); -- Logitech MX Master 3

-- Inserimento Ordine (con total)
INSERT INTO orders (name, lastname, email, address, telephone, order_date, total, promotion_id) VALUES
('Mario', 'Rossi', 'mario.rossi@email.com', 'Via Roma 1, Milano', '1234567890', CURRENT_TIMESTAMP, 1169.99, 2);
-- Nota: total è il prezzo scontato (discount_price) del MacBook Air M2, applicando la promozione WELCOME10 (10% di sconto)

-- Inserimento Prodotti Ordinati
INSERT INTO product_order (order_id, product_id, quantity, price, name) VALUES
(1, 1, 1, 1299.99, 'MacBook Air M2');



-- APPLICA NUOVA PATCH al db
-- inserimento e aggiornamento laptop
INSERT INTO products (slug, brand_id, category, name, model, price, discount_price, image_url, created_at, stock, description) VALUES
('apple-macbook-pro-14', 1, 'laptop', 'MacBook Pro 14 M3', 'A2918', 1999.99, 1799.99, NULL, CURRENT_TIMESTAMP, 15, 'Laptop con chip M3 per professionisti'),
('dell-alienware-m16', 2, 'laptop', 'Dell Alienware M16', 'AW1623', 2499.99, NULL, NULL, CURRENT_TIMESTAMP, 8, 'Laptop gaming con display QHD+'),
('hp-envy-16', 3, 'laptop', 'HP Envy 16', '16-H1023DX', 1699.99, 1499.99, NULL, CURRENT_TIMESTAMP, 12, 'Laptop creativo con display 4K'),
('asus-vivobook-15', 4, 'laptop', 'Asus VivoBook 15', 'X1502ZA', 799.99, NULL, NULL, CURRENT_TIMESTAMP, 20, 'Laptop per uso quotidiano con design moderno'),
('msi-prestige-14', 5, 'laptop', 'MSI Prestige 14', 'A12SC', 1399.99, NULL, NULL, CURRENT_TIMESTAMP, 10, 'Laptop leggero per professionisti');

-- inserimento e aggiornamento laptop details
INSERT INTO laptop_details (product_id, processor, ram, memory, video_card, os, year) VALUES
(21, 'Apple M3', 16, 512, 'Integrated', 'macOS', 2024), -- MacBook Pro 14 M3
(22, 'AMD Ryzen 9', 32, 1000, 'NVIDIA RTX 4070', 'Windows 11', 2023), -- Dell Alienware M16
(23, 'Intel i7', 16, 1000, 'Integrated', 'Windows 11', 2023), -- HP Envy 16
(24, 'Intel i5', 8, 256, 'Integrated', 'Windows 11', 2023), -- Asus VivoBook 15
(25, 'Intel i7', 16, 512, 'NVIDIA GTX 1650', 'Windows 11', 2023); -- MSI Prestige 14;

-- inserimento accessori
INSERT INTO products (slug, brand_id, category, name, model, price, discount_price, image_url, created_at, stock, description) VALUES
('apple-magic-keyboard', 1, 'accessory', 'Apple Magic Keyboard', 'MK2A3LL/A', 129.99, 109.99, NULL, CURRENT_TIMESTAMP, 30, 'Tastiera wireless con Touch ID'),
('dell-portable-ssd', 2, 'accessory', 'Dell Portable SSD', 'DP-500GB', 99.99, NULL, NULL, CURRENT_TIMESTAMP, 25, 'SSD portatile da 500GB'),
('hp-bluetooth-speaker', 3, 'accessory', 'HP Bluetooth Speaker', 'S6500', 49.99, NULL, NULL, CURRENT_TIMESTAMP, 40, 'Altoparlante Bluetooth portatile'),
('asus-usb-c-adapter', 4, 'accessory', 'Asus USB-C Adapter', 'UA-2023', 39.99, NULL, NULL, CURRENT_TIMESTAMP, 50, 'Adattatore USB-C multiporta'),
('msi-gaming-mouse', 5, 'accessory', 'MSI Gaming Mouse', 'GM-2023', 69.99, 59.99, NULL, CURRENT_TIMESTAMP, 35, 'Mouse gaming con RGB');

-- inserimento accessory-details
INSERT INTO accessory_details (product_id, type, compatibility) VALUES
(21, 'Keyboard', 'macOS, iOS'), -- Apple Magic Keyboard
(22, 'SSD External', 'Windows, macOS, Linux'), -- Dell Portable SSD
(23, 'Speaker', 'Bluetooth, Windows, macOS, Android, iOS'), -- HP Bluetooth Speaker
(24, 'Adapter', 'Windows, macOS, Linux'), -- Asus USB-C Adapter
(25, 'Mouse', 'Windows, macOS'); -- MSI Gaming Mouse



