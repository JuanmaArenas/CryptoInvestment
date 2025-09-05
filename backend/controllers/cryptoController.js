import { getCryptosFromDB } from '../services/cryptoService.js';

export const listAll = async (req, res) => {
    try {
        // Usamos la nueva función que lee de la base de datos
        const data = await getCryptosFromDB();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};