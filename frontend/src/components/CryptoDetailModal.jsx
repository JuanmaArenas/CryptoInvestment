// src/components/CryptoDetailModal.jsx
import React, { useState, useEffect } from 'react';
import { getCryptoDetails } from '../services/api';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    CircularProgress,
    Typography,
    Box,
    Avatar,
    Chip,
    Link
} from '@mui/material';

function CryptoDetailModal({ cryptoId, open, onClose }) {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && cryptoId) {
            const fetchDetails = async () => {
                setLoading(true);
                try {
                    const response = await getCryptoDetails(cryptoId);
                    setDetails(response.data);
                } catch (error) {
                    console.error("Failed to fetch details", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchDetails();
        }
    }, [cryptoId, open]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogContent>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : details ? (
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar src={details.logo} sx={{ width: 40, height: 40, mr: 2 }} />
                            <DialogTitle sx={{ p: 0 }}>{details.name} ({details.symbol})</DialogTitle>
                        </Box>
                        <Typography variant="body1" paragraph>{details.description}</Typography>
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