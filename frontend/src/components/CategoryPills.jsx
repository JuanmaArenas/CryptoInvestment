// src/components/CategoryPills.jsx
import React from 'react';
import { Box, Chip, CircularProgress } from '@mui/material';

function CategoryPills({ categories, selectedCategoryId, onSelect, loading }) {
    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
            {categories.map(category => (
                <Chip
                    key={category.id}
                    label={category.name}
                    clickable
                    color={selectedCategoryId === category.id ? 'primary' : 'default'}
                    onClick={() => onSelect(category.id)}
                />
            ))}
        </Box>
    );
}

export default CategoryPills;