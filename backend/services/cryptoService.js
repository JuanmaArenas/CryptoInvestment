import axios from 'axios';

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