import React, { useState, useEffect, useRef } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BackgroundImageChanger: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean>(false);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setCameraPermission(status === 'granted');

        const savedImage = await AsyncStorage.getItem('backgroundImage');
        if (savedImage) {
          setBackgroundImage(savedImage);
        }
      } catch (error) {
        console.error('Error initializing permissions or fetching image:', error);
      }
    };

    initialize();
  }, []);

  const takePhoto = async () => {
    if (cameraPermission) {
      setShowCamera(true);
    } else {
      Alert.alert('Permiso no concedido', 'No se ha otorgado permiso para usar la cámara.');
    }
  };

  const handleCameraCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setShowCamera(false);
        if (photo.uri) {
          setBackgroundImage(photo.uri);
          await AsyncStorage.setItem('backgroundImage', photo.ur);
        }
      } catch (error) {
        console.error('Error al tomar la foto:', error);
      }
    }
  };

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setBackgroundImage(uri);
        await AsyncStorage.setItem('backgroundImage', uri);
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
    }
  };

  return (
    <View style={styles.container}>
      {showCamera ? (
        <Camera
          style={styles.camera}
          type={CameraType.back}
          ref={cameraRef}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => setShowCamera(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleCameraCapture}>
              <Text style={styles.buttonText}>Tomar Foto</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <>
          <Image
            source={backgroundImage ? { uri: backgroundImage } : require('../../assets/default-background.jpg')}
            style={styles.backgroundImage}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Text style={styles.buttonText}>Tomar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={selectImage}>
              <Text style={styles.buttonText}>Seleccionar de Galería</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default BackgroundImageChanger;
