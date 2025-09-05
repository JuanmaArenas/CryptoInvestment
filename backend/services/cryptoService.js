import axios from 'axios';
import dbPool from '../config/db.js'; // Importamos el pool de la BD

const apiClient = axios.create({
    baseURL: process.env.COINMARKETCAP_BASE_URL,
    headers: {
        'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
    },
});

export const getAllCryptos = async () => {
    try {
        const response = await apiClient.get('/v1/cryptocurrency/map');
        return response.data;
    } catch (error) {
        console.error('Error fetching from CoinMarketCap API:', error.message);
        throw new Error('Failed to fetch data from CoinMarketCap');
    }
};

export const getCryptosFromDB = async () => {
    try {
        const [rows] = await dbPool.query('SELECT * FROM cryptocurrencies ORDER BY name ASC');
        return rows;
    } catch (error) {
        console.error('Error fetching from database:', error);
        throw new Error('Failed to fetch data from database');
    }
};

export const getQuotesByIds = async (ids) => {
    try {
        const response = await apiClient.get('/v2/cryptocurrency/quotes/latest', {
            params: {
                id: ids // Pasamos los IDs como query param
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching quotes from CoinMarketCap API:', error.message);
        throw new Error('Failed to fetch quotes from CoinMarketCap');
    }
};