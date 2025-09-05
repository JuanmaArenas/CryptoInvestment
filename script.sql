-- Creamos la base de datos si no existe
CREATE DATABASE IF NOT EXISTS cryptoinvestment_db;

-- Usamos la base de datos
USE cryptoinvestment_db;

-- Tabla para almacenar las criptomonedas seleccionadas por el grupo
CREATE TABLE cryptocurrencies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    api_id INT NOT NULL UNIQUE, -- ID de la API de CoinMarketCap para evitar duplicados
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(20) NOT NULL UNIQUE
);

-- Tabla para almacenar el historial de precios y otros datos
CREATE TABLE price_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    crypto_id INT NOT NULL,
    price DECIMAL(20, 8) NOT NULL,
    market_cap BIGINT,
    percent_change_24h DECIMAL(8, 4),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (crypto_id) REFERENCES cryptocurrencies(id) ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento de las búsquedas
CREATE INDEX idx_crypto_id ON price_history(crypto_id);
CREATE INDEX idx_recorded_at ON price_history(recorded_at);