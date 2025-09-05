// routes/categoryRoutes.js
import express from 'express';
import { listAllCategories, getCategory } from '../controllers/categoryController.js';

const router = express.Router();

// Ruta para obtener TODAS las categorías
router.get('/', listAllCategories);

// Ruta para obtener una categoría específica por ID
router.get('/:id', getCategory);

export default router;