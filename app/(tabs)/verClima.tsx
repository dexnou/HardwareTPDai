import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';

const VerClima = () => {
    const [fecha, setFecha] = useState(new Date());
    const [ubicacion, setUbicacion] = useState(null);
    const [temperatura, setTemperatura] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => setFecha(new Date()), 1000);
        obtenerUbicacionYClima();
        return () => clearInterval(timer);
    }, []);
    
    const obtenerUbicacionYClima = async () => {
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.error('Permiso de ubicación denegado');
            return;
          }
          let location = await Location.getCurrentPositionAsync({});
          setUbicacion(location.coords);
          const apiKey = '70947f7b444b5f41c0ca0e10d29f1a9a';
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=metric&appid=${apiKey}`;
          const response = await axios.get(url);
          setTemperatura(response.data.main.temp);
        } catch (error) {
          console.error('Error al obtener ubicación o clima:', error);
        }
    };

    return(
        <View>
            <Text>Fecha: {fecha.toLocaleString()}</Text>
            {temperatura !== null && (<Text>Temperatura: {temperatura}°C</Text>)}
            {ubicacion && (<Text>Ubicación: {ubicacion.latitude.toFixed(4)}, {ubicacion.longitude.toFixed(4)}</Text>)}
        </View>
    )
}

export default VerClima;