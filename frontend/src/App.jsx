// src/App.jsx
import React, { useState, useEffect } from 'react';
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
  const [allCryptos, setAllCryptos] = useState([]); // Lista completa original
  const [filteredCryptos, setFilteredCryptos] = useState([]); // Lista para mostrar en la tabla
  const [watchlist, setWatchlist] = useState(() => {
    const savedWatchlist = localStorage.getItem('cryptoWatchlist');
    return savedWatchlist ? JSON.parse(savedWatchlist) : [];
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  // Usamos nuestro hook para obtener los precios en tiempo real
  const liveQuotes = useCryptoPolling(coinsToPoll, 30000);

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
                    onAdd={handleAddCrypto}
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
                onRemove={handleRemoveCrypto}
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