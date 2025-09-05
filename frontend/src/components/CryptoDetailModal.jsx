// src/components/CryptoDetailModal.jsx
import React, { useState, useEffect } from 'react';
import { getCryptoDetails, getQuotes } from '../services/api'; // Import getQuotes
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    CircularProgress,
    Typography,
    Box,
    Avatar,
    Chip,
    Link,
    Grid,
    Card,
    CardContent
} from '@mui/material';

// Helper for Stat Cards
const StatCard = ({ title, value }) => {
    if (typeof value !== 'number') return null;
    const isPositive = value >= 0;
    return (
        <Grid item xs={4}>
            <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">{title}</Typography>
                    <Typography variant="h6" color={isPositive ? 'success.main' : 'error.main'}>
                        {value.toFixed(2)}%
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
};

function CryptoDetailModal({ cryptoId, open, onClose }) {
    const [details, setDetails] = useState(null);
    const [quoteData, setQuoteData] = useState(null); // New state for market data
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && cryptoId) {
            const fetchAllDetails = async () => {
                setLoading(true);
                try {
                    // Fetch both details and market quotes in parallel
                    const [detailsResponse, quotesResponse] = await Promise.all([
                        getCryptoDetails(cryptoId),
                        getQuotes([cryptoId]) // getQuotes expects an array of IDs
                    ]);
                    setDetails(detailsResponse.data);
                    setQuoteData(quotesResponse.data[cryptoId]); // API returns quotes nested by ID
                } catch (error) {
                    console.error("Failed to fetch all details", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchAllDetails();
        }
    }, [cryptoId, open]);

    // Data for the bar chart
    const marketCapData = quoteData ? [
        { name: 'Market Cap', value: quoteData.quote.USD.market_cap },
        { name: 'Fully Diluted', value: quoteData.quote.USD.fully_diluted_market_cap },
    ] : [];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogContent>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
                ) : details ? (
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar src={details.logo} sx={{ width: 40, height: 40, mr: 2 }} />
                            <DialogTitle sx={{ p: 0 }}>{details.name} ({details.symbol})</DialogTitle>
                        </Box>
                        <Typography variant="body1" paragraph>{details.description}</Typography>

                        {/* Percentage Change Stats */}
                        {quoteData && (
                            <Grid container spacing={2} sx={{ my: 2 }}>
                                <StatCard title="Change (1h)" value={quoteData.quote.USD.percent_change_1h} />
                                <StatCard title="Change (24h)" value={quoteData.quote.USD.percent_change_24h} />
                                <StatCard title="Change (7d)" value={quoteData.quote.USD.percent_change_7d} />
                            </Grid>
                        )}

                        {/* Market Cap Chart */}
                        {quoteData && (
                            <Box sx={{ height: 200, my: 4 }}>
                                <Typography variant="h6">Market Cap Comparison</Typography>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={marketCapData} layout="vertical">
                                        <XAxis type="number" hide />
                                        <YAxis type="category" dataKey="name" width={100} />
                                        <Tooltip formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)} />
                                        <Bar dataKey="value" fill="#8884d8" barSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        )}

                        <Box sx={{ my: 2 }}>
                            {details.tags.map(tag => <Chip label={tag} key={tag} sx={{ mr: 1, mb: 1 }} />)}
                        </Box>
                        <Link href={details.urls.website[0]} target="_blank" rel="noopener">
                            Visit Website
                        </Link>
                    </Box>
                ) : (
                    <Typography>Could not load details.</Typography>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default CryptoDetailModal;