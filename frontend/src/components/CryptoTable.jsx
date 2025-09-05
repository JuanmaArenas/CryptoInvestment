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
                    {cryptos.map((crypto) => (
                        <TableRow
                            key={crypto.id}
                            hover // Add hover effect
                            onClick={() => onRowClick(crypto.api_id)} // Trigger the click handler
                            sx={{ cursor: 'pointer' }} // Change cursor on hover
                        >
                            <TableCell>{crypto.name}</TableCell>
                            <TableCell>{crypto.symbol}</TableCell>
                            <TableCell align="right">
                                {/* New button that calls the onAdd function */}
                                <Button variant="contained" size="small" onClick={() => onAdd(crypto)}>
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