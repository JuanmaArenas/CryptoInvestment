import 'dotenv/config';
import dbPool from './config/db.js';
import { getAllCryptos } from './services/cryptoService.js';

const seedDatabase = async () => {
    let connection;
    try {
        console.log('🚀 Iniciando el seeder...');

        // 1. Obtener los datos de la API de CoinMarketCap
        console.log('Obteniendo datos de la API...');
        const apiData = await getAllCryptos();
        const cryptos = apiData.data;
        console.log(`Se encontraron ${cryptos.length} criptomonedas.`);

        // 2. Formatear los datos para la inserción en la base de datos
        // Creamos un array de arrays: [[api_id, name, symbol], [api_id, name, symbol], ...]
        const cryptoValues = cryptos.map(crypto => [
            crypto.id,
            crypto.name,
            crypto.symbol
        ]);

        // 3. Insertar los datos en la base de datos
        console.log('Insertando datos en la base de datos...');
        connection = await dbPool.getConnection();

        // Usamos 'INSERT IGNORE' para evitar errores si una moneda ya existe (por su 'symbol' UNIQUE)
        const query = 'INSERT IGNORE INTO cryptocurrencies (api_id, name, symbol) VALUES ?';

        // [cryptoValues] es un array que contiene el array de valores, necesario para la inserción masiva
        await connection.query(query, [cryptoValues]);

        console.log('✅ ¡Seeder completado! La base de datos ha sido poblada.');

    } catch (error) {
        console.error('❌ Error durante el proceso de seeder:', error);
    } finally {
        // 4. Asegurarnos de liberar la conexión a la base de datos
        if (connection) {
            connection.release();
            console.log('Conexión a la base de datos liberada.');
        }
        // Cerramos el pool para que el script termine
        await dbPool.end();
    }
};

// Ejecutar la función
seedDatabase();