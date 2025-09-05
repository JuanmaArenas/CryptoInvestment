import express from 'express';
import { listAll, getQuotes } from '../controllers/cryptoController.js';

const router = express.Router();

router.get('/', listAll);
router.get('/quotes', getQuotes);

export default router;