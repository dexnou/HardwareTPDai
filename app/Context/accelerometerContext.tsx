// AccelerometerContext.js
/*
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors'; // Asegúrate de tener instalada la biblioteca 'expo-sensors'

const AccelerometerContext = createContext();

export const AccelerometerProvider = ({ children }) => {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  
  useEffect(() => {
    const subscription = Accelerometer.addListener(accelerometerData => {
      setData(accelerometerData);
    });

    // Opcional: puedes ajustar la frecuencia de actualización aquí
    Accelerometer.setUpdateInterval(100);

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <AccelerometerContext.Provider value={data}>
      {children}
    </AccelerometerContext.Provider>
  );
};

export const useAccelerometer = () => useContext(AccelerometerContext);
*/
