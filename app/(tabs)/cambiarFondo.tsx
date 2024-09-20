import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, ImageBackground } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [camera, setCamera] = useState<Camera | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isCameraVisible, setIsCameraVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      const savedImage = await AsyncStorage.getItem('backgroundImage');
      if (savedImage) {
        setBackgroundImage(savedImage);
      }
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      await saveImage(photo.uri);
      setIsCameraVisible(false);
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

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <ImageBackground source={backgroundImage ? { uri: backgroundImage } : undefined} style={styles.container}>
      {isCameraVisible ? (
        <Camera style={styles.camera} type={type} ref={(ref) => setCamera(ref)}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}>
              <Text style={styles.text}> Flip </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}> Snap </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setIsCameraVisible(false)}>
              <Text style={styles.text}> Back </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setIsCameraVisible(true)}>
            <Text style={styles.text}>Abrir Cámara</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.text}>Elegir Foto</Text>
          </TouchableOpacity>
        </View>
      )}
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
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 20,
  },
  button: {
    flex: 0.3,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    margin: 5,
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});