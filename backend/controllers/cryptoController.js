import { getAllCryptos } from '../services/cryptoService.js';

export const listAll = async (req, res) => {
    try {
        const data = await getAllCryptos();
        res.status(200).json(data.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};