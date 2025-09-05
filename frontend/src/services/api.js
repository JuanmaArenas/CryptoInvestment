// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api', // La URL de nuestro backend
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getCryptoList = () => {
    return apiClient.get('/cryptos');
};

export const getQuotes = (ids) => {
    return apiClient.get(`/cryptos/quotes`, {
        params: { ids: ids.join(',') } // Joins array of IDs into "1,1027"
    });
};

export const getCryptoDetails = (id) => {
    return apiClient.get(`/cryptos/info/${id}`);
};