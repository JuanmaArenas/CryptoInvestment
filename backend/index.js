import 'dotenv/config'; // Forma moderna de cargar dotenv
import express from 'express';
import cors from 'cors';
import cryptoRoutes from './routes/cryptoRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('¡El servidor backend de CryptoInvestment está funcionando! 🚀');
});

// Rutas
app.use('/api/cryptos', cryptoRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});