import { getCryptosFromDB, getQuotesByIds, getCryptoInfo } from '../services/cryptoService.js';


export const listAll = async (req, res) => {
    try {
        // Usamos la nueva función que lee de la base de datos
        const data = await getCryptosFromDB();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getQuotes = async (req, res) => {
    try {
        const { ids } = req.query; // Leemos los IDs desde la URL (ej: ?ids=1,1027)
        if (!ids) {
            return res.status(400).json({ message: 'No se proporcionaron IDs de monedas.' });
        }
        const data = await getQuotesByIds(ids);
        res.status(200).json(data.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getInfo = async (req, res) => {
    try {
        const { id } = req.params; // Read ID from the URL path (e.g., /info/1)
        if (!id) {
            return res.status(400).json({ message: 'No se proporcionó un ID de moneda.' });
        }
        const data = await getCryptoInfo(id);
        // The API nests the data under the ID, so we extract it
        res.status(200).json(data.data[id]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};