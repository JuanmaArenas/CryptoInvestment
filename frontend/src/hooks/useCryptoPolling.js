// src/hooks/useCryptoPolling.js
import { useState, useEffect, useRef } from 'react';
import { getQuotes } from '../services/api';

export const useCryptoPolling = (coins, interval = 31000) => {
    const [liveQuotes, setLiveQuotes] = useState({});
    // Usamos useRef para evitar que el ID del intervalo se resetee en cada render
    const intervalIdRef = useRef(null);

    useEffect(() => {
        // Detenemos cualquier intervalo anterior al cambiar las monedas
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
        }

        const fetchPrices = async () => {
            if (coins.length === 0) {
                setLiveQuotes({});
                return;
            }

            const ids = coins.map(c => c.api_id || c.id);
            try {
                const response = await getQuotes(ids);
                // !! CAMBIO CLAVE AQUÍ !!
                // Guardamos el objeto quote.USD completo, no solo el precio
                const quoteMap = Object.values(response.data).reduce((acc, curr) => {
                    acc[curr.id] = curr.quote.USD;
                    return acc;
                }, {});
                setLiveQuotes(prevQuotes => ({ ...prevQuotes, ...quoteMap }));
            } catch (error) {
                console.error("Failed to fetch live prices", error);
            }
        };

        fetchPrices(); // Llamada inicial

        // Establecemos el nuevo intervalo
        intervalIdRef.current = setInterval(fetchPrices, interval);

        // Función de limpieza para detener el intervalo cuando el componente se desmonte
        return () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
        };
    }, [coins, interval]); // Se ejecuta de nuevo si la lista de monedas o el intervalo cambian

    return liveQuotes;
};