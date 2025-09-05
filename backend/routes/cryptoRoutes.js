import express from 'express';
import { listAll } from '../controllers/cryptoController.js';

const router = express.Router();

router.get('/', listAll);

export default router;