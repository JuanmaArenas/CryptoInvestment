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
    Button // Import Button
} from '@mui/material';

// We now accept an 'onAdd' function as a prop
function CryptoTable({ cryptos, onAdd, onRowClick }) {
    return (
        <TableContainer component={Paper}>
            <Typography variant="h6" sx={{ p: 2 }}>
                Available Cryptocurrencies
            </Typography>
            <Table aria-label="crypto table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Symbol</TableCell>
                        <TableCell align="right">Action</TableCell> {/* New Column Header */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cryptos.map((coin) => (
                        <TableRow
                            key={coin.id}
                            hover // Add hover effect
                            onClick={() => onRowClick(coin.id)} // Trigger the click handler
                            sx={{ cursor: 'pointer' }} // Change cursor on hover
                        >
                            <TableCell>{coin.name}</TableCell>
                            <TableCell>{coin.symbol}</TableCell>
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
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CryptoTable;