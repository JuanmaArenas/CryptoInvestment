// Cargar las variables de entorno del archivo .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Permite al servidor entender JSON

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡El servidor backend de CryptoInvestment está funcionando! 🚀');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});