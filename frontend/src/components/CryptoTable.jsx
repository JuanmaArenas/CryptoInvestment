// src/components/CryptoTable.jsx
import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button, // Import Button
    Avatar,
    Box,
    IconButton
} from '@mui/material';
import Star from '@mui/icons-material/Star';         // 2. Importar el ícono de estrella rellena
import StarBorder from '@mui/icons-material/StarBorder'; // 2. Importar el ícono de estrella vacía


const formatPrice = (price) => {
    console.log('Formatting price:', price);
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
};


// We now accept an 'onAdd' function as a prop
function CryptoTable({ cryptos, onToggleWatchlist, watchlistIds, onRowClick, liveQuotes }) {
    return (
        <TableContainer component={Paper} sx={{
            overflowY: 'auto', maxHeight: 600
        }}>
            <Typography variant="h6" sx={{ p: 2 }}>
                Available Cryptocurrencies
            </Typography>
            <Table aria-label="crypto table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Symbol</TableCell>
                        <TableCell>Latest Price</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cryptos.map((coin) => {
                        const quoteData = liveQuotes[coin.id];
                        const isAdded = watchlistIds.has(coin.id);
                        return (
                            <TableRow
                                key={coin.id}
                                hover // Add hover effect
                                onClick={() => onRowClick(coin.id)} // Trigger the click handler
                                sx={{ cursor: 'pointer' }} // Change cursor on hover
                            >
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar
                                            src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`}
                                            sx={{ width: 24, height: 24, mr: 1.5 }}
                                        />
                                        {coin.name}
                                    </Box>
                                </TableCell>
                                <TableCell>{coin.symbol}</TableCell>
                                <TableCell>
                                    {quoteData ? '$' + quoteData?.price : '...'}
                                    {/**quoteData ? formatPrice(quoteData.price) : '...'**/}
                                </TableCell>
                                <TableCell align="right">
                                    {/* 5. Renderizamos el IconButton con el ícono condicional */}
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleWatchlist({ id: coin.id, api_id: coin.id, name: coin.name, symbol: coin.symbol });
                                        }}
                                    >
                                        {isAdded ? <Star sx={{ color: 'warning.main' }} /> : <StarBorder />}
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CryptoTable;