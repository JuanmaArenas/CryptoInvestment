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
    Box
} from '@mui/material';


const formatPrice = (price) => {
    console.log('Formatting price:', price);
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
};


// We now accept an 'onAdd' function as a prop
function CryptoTable({ cryptos, onAdd, onRowClick, liveQuotes }) {
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
                        <TableCell align="right">Action</TableCell> {/* New Column Header */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cryptos.map((coin) => {
                        const quoteData = liveQuotes[coin.id];
                        console.log({coin})
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
                                    {/* New button that calls the onAdd function */}
                                    <Button variant="contained" size="small" onClick={(e) => {
                                        e.stopPropagation(); // Evita que se abra el modal al hacer clic en el botón
                                        onAdd({ id: coin.id, api_id: coin.id, name: coin.name, symbol: coin.symbol });
                                    }}>
                                        Add
                                    </Button>
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