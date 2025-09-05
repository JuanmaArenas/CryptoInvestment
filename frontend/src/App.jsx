// src/App.jsx
import React, { useState, useEffect } from 'react';
import { getCryptoList } from './services/api';
import CryptoTable from './components/CryptoTable';
import WatchlistTable from './components/WatchlistTable';
import { Container, CssBaseline, Typography, TextField, Box, Grid } from '@mui/material';

function App() {
  const [allCryptos, setAllCryptos] = useState([]); // Lista completa original
  const [filteredCryptos, setFilteredCryptos] = useState([]); // Lista para mostrar en la tabla
  const [watchlist, setWatchlist] = useState(() => {
    const savedWatchlist = localStorage.getItem('cryptoWatchlist');
    return savedWatchlist ? JSON.parse(savedWatchlist) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  //Guardar la watchlist en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('cryptoWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Carga inicial de todas las criptomonedas
  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await getCryptoList();
        setAllCryptos(response.data);
        setFilteredCryptos(response.data); // Inicialmente, la lista filtrada es la lista completa
      } catch (err) {
        setError('No se pudieron cargar los datos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCryptos();
  }, []);

  // Efecto para filtrar las criptomonedas cuando el término de búsqueda cambia
  useEffect(() => {
    const results = allCryptos.filter(crypto =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCryptos(results);
  }, [searchTerm, allCryptos]);

  // Añadir crypto a watchlist
  const handleAddCrypto = (cryptoToAdd) => {
    // Prevent adding the same crypto twice
    if (!watchlist.find(crypto => crypto.id === cryptoToAdd.id)) {
      setWatchlist([...watchlist, cryptoToAdd]);
    }
  };

  // Remover crypto de watchlist
  const handleRemoveCrypto = (cryptoToRemove) => {
    setWatchlist(watchlist.filter(crypto => crypto.id !== cryptoToRemove.id));
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl"> {/* Usamos maxWidth="xl" para dar más espacio */}
        <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4, textAlign: 'center' }}>
          CryptoInvestment Tracker
        </Typography>

        <Grid container spacing={4}> {/* Contenedor principal del Grid */}

          {/* Columna Izquierda: Watchlist */}
          <Grid item xs={12} md={5}> {/* Ocupa 12/12 en pantallas pequeñas, 5/12 en medianas y grandes */}
            <WatchlistTable watchlist={watchlist} onRemove={handleRemoveCrypto} />
          </Grid>

          {/* Columna Derecha: Búsqueda y Tabla Completa */}
          <Grid item xs={12} md={7}> {/* Ocupa 12/12 en pantallas pequeñas, 7/12 en medianas y grandes */}
            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                label="Search Cryptocurrency"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Box>

            {loading && <p>Cargando criptomonedas...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && (
              <CryptoTable cryptos={filteredCryptos} onAdd={handleAddCrypto} />
            )}
          </Grid>

        </Grid>
      </Container>
    </>
  );
}

export default App;