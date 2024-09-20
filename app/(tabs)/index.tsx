import { Image, StyleSheet, Platform, Linking, Alert } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import React, {useState, useEffect} from 'react';
import { Accelerometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function HomeScreen() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const THRESHOLD = 1.5; // Umbral para detectar sacudida
  const INTERVAL = 100; // Intervalo de actualización en ms
  let WHATSAPP_NUMBER: Promise<string | null>;

  useEffect(() => {
    WHATSAPP_NUMBER = AsyncStorage.getItem('num');
  }, [])
  

  useEffect(() => {
    const subscription = Accelerometer.addListener(accelerometerData => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastUpdate;
  
      if (deltaTime > INTERVAL) {
        const { x, y, z } = accelerometerData;
        setData(accelerometerData);
  
        const magnitude = Math.sqrt(x * x + y * y + z * z);
  
        if (magnitude > THRESHOLD) {
          handleShake();
        }
  
        setLastUpdate(currentTime);
      }
    });
  
    Accelerometer.setUpdateInterval(INTERVAL);
  
    return () => {
      subscription.remove();
    };
  }, []);  

  const handleShake = () => {
    sendMessage();
  };

  const sendMessage = () => {
    const url = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=¡Sacudida detectada!`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir WhatsApp. Asegúrate de que WhatsApp esté instalado.');
    });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
