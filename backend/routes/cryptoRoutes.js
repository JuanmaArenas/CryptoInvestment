import express from 'express';
import { listAll, getQuotes, getInfo } from '../controllers/cryptoController.js';

const router = express.Router();

router.get('/', listAll);
router.get('/quotes', getQuotes);
router.get('/info/:id', getInfo);

export default router;