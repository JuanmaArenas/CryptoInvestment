// src/App.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { getCryptoList, getCategories, getCategoryDetails } from './services/api';
import CryptoTable from './components/CryptoTable';
import WatchlistTable from './components/WatchlistTable';
import {
  Container, CssBaseline, Typography, TextField, Box, Grid, CircularProgress,
  ThemeProvider,
  createTheme
} from '@mui/material';
import CryptoDetailModal from './components/CryptoDetailModal';
import CategoryPills from './components/CategoryPills';
import CategoryCharts from './components/CategoryCharts';
import { useCryptoPolling } from './hooks/useCryptoPolling';

// 2. Definir nuestro tema oscuro
const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Esto activa el modo oscuro de MUI
    primary: {
      main: '#90caf9', // Un azul claro agradable para los elementos primarios
    },
    background: {
      default: '#121212', // Un fondo oscuro estándar
      paper: '#1e1e1e',   // El color para superficies como tablas y tarjetas
    },
  },
});

function App() {
  // Crytos favoritas en el localstorage
  const [watchlist, setWatchlist] = useState(() => {
    const savedWatchlist = localStorage.getItem('cryptoWatchlist');
    return savedWatchlist ? JSON.parse(savedWatchlist) : [];
  });

  const [selectedCryptoId, setSelectedCryptoId] = useState(null);

  // Nuevo estado para categorías y monedas
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [categoryCoins, setCategoryCoins] = useState([]);
  const [selectedCategoryData, setSelectedCategoryData] = useState(null);

  // Estado para la carga y errores
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingCoins, setLoadingCoins] = useState(false);


  // Creamos una lista combinada y única de monedas para el polling
  const coinsToPoll = React.useMemo(() => {
    const combined = [...watchlist, ...categoryCoins];
    // Eliminamos duplicados basados en el ID
    const unique = Array.from(new Map(combined.map(c => [c.id, c])).values());
    return unique;
  }, [watchlist, categoryCoins]);

  // 1. Creamos un Set de IDs para búsquedas súper rápidas.
  //    useMemo asegura que no se recalcule en cada render.
  const watchlistIds = useMemo(() => new Set(watchlist.map(c => c.api_id || c.id)), [watchlist]);

  // 2. Nueva función para alternar el estado en la watchlist
  const handleToggleWatchlist = (coin) => {
    // Usamos el Set para verificar si la moneda ya está agregada
    if (watchlistIds.has(coin.api_id)) {
      // Si está, la eliminamos
      setWatchlist(prev => prev.filter(c => c.api_id !== coin.api_id));
    } else {
      // Si no está, la agregamos
      setWatchlist(prev => [...prev, coin]);
    }
  };

  const handleRemoveFromWatchlist = (coin) => {
    setWatchlist(prev => prev.filter(c => c.api_id !== coin.api_id));
  };

  // Usamos nuestro hook para obtener los precios en tiempo real
  const liveQuotes = useCryptoPolling(coinsToPoll, 31000);

  const handleOpenModal = (cryptoId) => {
    setSelectedCryptoId(cryptoId);
  };

  const handleCloseModal = () => {
    setSelectedCryptoId(null);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  // Añadir crypto a watchlist
  const handleAddCrypto = (cryptoToAdd) => {
    // Prevent adding the same crypto twice
    if (!watchlist.find(crypto => crypto.id === cryptoToAdd.id)) {
      setWatchlist([...watchlist, cryptoToAdd]);
    }
  };

  // Cargar todas las categorías al iniciar
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Cargar las monedas de una categoría cuando se selecciona
  useEffect(() => {
    if (!selectedCategoryId) return;

    const fetchCategoryCoins = async () => {
      setLoadingCoins(true);
      try {
        const response = await getCategoryDetails(selectedCategoryId);
        setCategoryCoins(response.data.coins);
      } catch (err) {
        console.error("Failed to load category coins", err);
      } finally {
        setLoadingCoins(false);
      }
    };
    fetchCategoryCoins();
  }, [selectedCategoryId]);

  //Guardar la watchlist en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('cryptoWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    if (!selectedCategoryId) return;

    const fetchCategoryCoins = async () => {
      setLoadingCoins(true);
      setSelectedCategoryData(null); // Limpiamos los datos anteriores
      try {
        const response = await getCategoryDetails(selectedCategoryId);
        setCategoryCoins(response.data.coins);
        setSelectedCategoryData(response.data); // Guardamos los datos de la categoría
      } catch (err) {
        console.error("Failed to load category coins", err);
      } finally {
        setLoadingCoins(false);
      }
    };
    fetchCategoryCoins();
  }, [selectedCategoryId]);


  // Remover crypto de watchlist
  const handleRemoveCrypto = (cryptoToRemove) => {
    setWatchlist(watchlist.filter(crypto => crypto.id !== cryptoToRemove.id));
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          minWidth: '100vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4, textAlign: 'center' }}>
            CryptoInvestment Tracker
          </Typography>

          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ textAlign: 'center', mb: 4 }}
          >
            Los precios se actualizan cada 30 segundos.
          </Typography>

          {/* Contenedor principal del Grid */}
          <Box className="main-container"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2
            }}>

            {/* --- COLUMNA DERECHA --- */}
            <Grid className="right-column" item xs={12} md={7} sx={{
              overflowY: 'auto'
            }}>
              <CategoryPills
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelect={handleCategorySelect}
                loading={loadingCategories}
              />

              {loadingCoins ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
              ) : (
                <>
                  <CryptoTable
                    cryptos={categoryCoins}
                    onToggleWatchlist={handleToggleWatchlist}
                    watchlistIds={watchlistIds}
                    onRowClick={handleOpenModal}
                    liveQuotes={liveQuotes}
                  />
                </>
              )}
            </Grid>

            {/* --- COLUMNA IZQUIERDA --- */}
            <Box className="left-column" item xs={12} md={5} sx={{
              overflowY: 'auto'
            }}>
              <WatchlistTable
                watchlist={watchlist}
                onRemove={handleRemoveFromWatchlist}
                onRowClick={handleOpenModal}
                liveQuotes={liveQuotes}
              />
              <CategoryCharts data={selectedCategoryData} />
            </Box>

          </Box>
        </Container>
      </Box>

      <CryptoDetailModal
        cryptoId={selectedCryptoId}
        open={Boolean(selectedCryptoId)}
        onClose={handleCloseModal}
      />
    </ ThemeProvider>
  );
}

export default App;