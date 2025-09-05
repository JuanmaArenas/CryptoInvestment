// src/App.jsx
import React, { useState, useEffect } from 'react';
import { getCryptoList, getCategories, getCategoryDetails } from './services/api';
import CryptoTable from './components/CryptoTable';
import WatchlistTable from './components/WatchlistTable';
import { Container, CssBaseline, Typography, TextField, Box, Grid, CircularProgress } from '@mui/material';
import CryptoDetailModal from './components/CryptoDetailModal';
import CategoryPills from './components/CategoryPills';

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

  // Estado para la carga y errores
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingCoins, setLoadingCoins] = useState(false);

  const handleOpenModal = (cryptoId) => {
    setSelectedCryptoId(cryptoId);
  };

  const handleCloseModal = () => {
    setSelectedCryptoId(null);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
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
            <WatchlistTable watchlist={watchlist} onRemove={handleRemoveCrypto} onRowClick={handleOpenModal} />
          </Grid>

          {/* Columna Derecha: Búsqueda y Tabla Completa */}
          <Grid item xs={12} md={7}>
            {/* Reemplazamos el buscador con las pills de categorías */}
            <CategoryPills
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelect={handleCategorySelect}
              loading={loadingCategories}
            />

            {loadingCoins ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
            ) : (
              <CryptoTable
                cryptos={categoryCoins}
                onAdd={handleAddCrypto}
                onRowClick={handleOpenModal}
              />
            )}
          </Grid>

        </Grid>
      </Container>

      <CryptoDetailModal
        cryptoId={selectedCryptoId}
        open={Boolean(selectedCryptoId)}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default App;