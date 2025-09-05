// src/components/WatchlistTable.jsx
import React, { useState, useEffect } from 'react';
import { getQuotes } from '../services/api';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Button
} from '@mui/material';

// Helper to format the price
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
};

// Helper to format percentage change
const formatChange = (change) => {
    const isPositive = change >= 0;
    return (
        <Typography color={isPositive ? 'success.main' : 'error.main'}>
            {change.toFixed(2)}%
        </Typography>
    );
};


function WatchlistTable({ watchlist, onRemove, onRowClick, liveQuotes }) {

    if (watchlist.length === 0) {
        return <Typography>Your watchlist is empty. Add a coin from the list below.</Typography>;
    }

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>My Watchlist</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Price (Live)</TableCell>
                            <TableCell>24h % Change</TableCell>
                            <TableCell align="right">Action</TableCell> {/* New Column */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {watchlist.map(crypto => {
                            const quoteData = liveQuotes[crypto.api_id || crypto.id];
                            return (
                                <TableRow
                                    key={crypto.id}
                                    hover
                                    onClick={() => onRowClick(crypto.api_id)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell>{crypto.name} ({crypto.symbol})</TableCell>
                                    <TableCell>{quoteData ? quoteData.price : 'Loading...'}</TableCell>
                                    {/* <TableCell>{quoteData ? formatPrice(quoteData.price) : 'Loading...'}</TableCell> */}
                                    <TableCell>{quoteData ? formatChange(quoteData.percent_change_24h) : 'Loading...'}</TableCell>
                                    <TableCell align="right">
                                        {/* New "Remove" button */}
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            // Aceptamos el evento (e) y detenemos su propagación
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onRemove(crypto);
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default WatchlistTable;