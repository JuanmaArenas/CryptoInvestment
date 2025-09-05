// src/components/CategoryCharts.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography, Box, Grid, Card, CardContent } from '@mui/material';

// Función para formatear números grandes (ej. 29B para 29 mil millones)
const formatNumber = (num) => {
    if (num > 1_000_000_000) {
        return `${(num / 1_000_000_000).toFixed(2)}B`;
    }
    if (num > 1_000_000) {
        return `${(num / 1_000_000).toFixed(2)}M`;
    }
    if (num > 1_000) {
        return `${(num / 1_000).toFixed(2)}K`;
    }
    return num;
};

// Helper para dar formato y color a los porcentajes
const StatCard = ({ title, value }) => {
    const isPositive = value >= 0;
    return (
        <Grid item xs={12} sm={4}>
            <Card>
                <CardContent>
                    <Typography variant="subtitle1" color="text.secondary">
                        {title}
                    </Typography>
                    <Typography variant="h5" color={isPositive ? 'success.main' : 'error.main'}>
                        {value.toFixed(2)}%
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
};
function CategoryCharts({ data }) {
    if (!data) {
        return null; // No mostrar nada si no hay datos de categoría
    }

    const chartData = [
        {
            name: data.name,
            "Market Cap": data.market_cap,
            "Volume 24h": data.volume,
        },
    ];

    return (
        <Paper sx={{ p: 2, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                Category Stats: {data.name}
            </Typography>

            {/* Sección para las tarjetas de estadísticas */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <StatCard title="Avg Price Change (24h)" value={data.avg_price_change} />
                <StatCard title="Market Cap Change (24h)" value={data.market_cap_change} />
                <StatCard title="Volume Change (24h)" value={data.volume_change} />
            </Grid>

            {/* Sección para el gráfico de barras */}
            <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={formatNumber} />
                        <Tooltip formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)} />
                        <Legend />
                        <Bar dataKey="Market Cap" fill="#8884d8" />
                        <Bar dataKey="Volume 24h" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
}

export default CategoryCharts;