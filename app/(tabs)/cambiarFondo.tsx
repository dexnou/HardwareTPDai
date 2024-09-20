import React, { useRef, useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, ImageBackground } from 'react-native';
import { Camera, CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<Camera | null>(null);

  useEffect(() => {
    (async () => {
      // Cargar la imagen de fondo guardada
      const savedImage = await AsyncStorage.getItem('backgroundImage');
      if (savedImage) {
        setBackgroundImage(savedImage);
      }
    })();
  }, []);

  const openCamera = async () => {
    if (!permission || !permission.granted) {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        alert('Se necesita permiso para usar la cámara');
        return;
      }
    }
    setShowCamera(true);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        skipProcessing: false,
      });
      await saveImage(photo.uri);
      setShowCamera(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      await saveImage(result.assets[0].uri);
    }
  };

  const saveImage = async (uri: string) => {
    try {
      await AsyncStorage.setItem('backgroundImage', uri);
      setBackgroundImage(uri);
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  const renderInitialButtons = () => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={openCamera}>
        <Text style={styles.text}>Usar cámara</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.text}>Elegir una foto</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCamera = () => (
    <CameraView style={styles.camera} type={facing} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Voltear cámara</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Text style={styles.text}>Tomar foto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setShowCamera(false)}>
          <Text style={styles.text}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </CameraView>
  );

  return (
    <ImageBackground source={backgroundImage ? { uri: backgroundImage } : undefined} style={styles.container}>
      {showCamera ? renderCamera() : renderInitialButtons()}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    margin: 5,
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});