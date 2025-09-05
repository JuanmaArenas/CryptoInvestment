// controllers/categoryController.js
import { getCategories, getCategoryById } from '../services/cryptoService.js';

// Maneja la solicitud para listar todas las categorías
export const listAllCategories = async (req, res) => {
    try {
        const data = await getCategories();
        res.status(200).json(data.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Maneja la solicitud para obtener una categoría por su ID
export const getCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'No se proporcionó un ID de categoría.' });
        }
        const data = await getCategoryById(id);
        res.status(200).json(data.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};