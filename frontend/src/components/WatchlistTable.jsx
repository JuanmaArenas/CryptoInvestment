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


function WatchlistTable({ watchlist, onRemove }) {
    const [liveData, setLiveData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Function to fetch quotes
        const fetchQuotes = async () => {
            if (watchlist.length === 0) {
                setLiveData({});
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const ids = watchlist.map(crypto => crypto.api_id);
                const response = await getQuotes(ids);
                setLiveData(response.data);
            } catch (error) {
                console.error("Failed to fetch quotes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuotes(); // Fetch immediately on change

        // Set up an interval to refresh data every 60 seconds
        const intervalId = setInterval(fetchQuotes, 60000);

        // Clean up the interval when the component unmounts or watchlist changes
        return () => clearInterval(intervalId);

    }, [watchlist]); // This effect re-runs whenever the watchlist changes

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
                            <TableCell>Price</TableCell>
                            <TableCell>24h % Change</TableCell>
                            <TableCell align="right">Action</TableCell> {/* New Column */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {watchlist.map(crypto => {
                            const data = liveData[crypto.api_id];
                            return (
                                <TableRow key={crypto.id}>
                                    <TableCell>{crypto.name} ({crypto.symbol})</TableCell>
                                    <TableCell>{data ? formatPrice(data.quote.USD.price) : 'Loading...'}</TableCell>
                                    <TableCell>{data ? formatChange(data.quote.USD.percent_change_24h) : 'Loading...'}</TableCell>
                                    <TableCell align="right">
                                        {/* New "Remove" button */}
                                        <Button variant="outlined" color="error" size="small" onClick={() => onRemove(crypto)}>
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