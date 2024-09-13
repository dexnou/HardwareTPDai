// import React, { useState, useEffect, useRef } from 'react';
// import { View, Image, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
// import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
// import * as ImagePicker from 'expo-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const BackgroundImageChanger: React.FC = () => {
//   const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
//   const [showCamera, setShowCamera] = useState<boolean>(false);
//   const [permission, requestPermission] = useCameraPermissions();
//   const [facing, setFacing] = useState<CameraType>('back');

//   useEffect(() => {
//     const initialize = async () => {
//       try {
//         const savedImage = await AsyncStorage.getItem('backgroundImage');
//         if (savedImage) {
//           setBackgroundImage(savedImage);
//         }
//       } catch (error) {
//         console.error('Error fetching saved image:', error);
//       }
//     };

//     initialize();
//   }, []);

//   const takePhoto = async () => {
//     if (permission?.granted) {
//       setShowCamera(true);
//     } else {
//       Alert.alert('Permiso no concedido', 'No se ha otorgado permiso para usar la cámara.', [
//         { text: 'Conceder Permiso', onPress: requestPermission },
//       ]);
//     }
//   };
  

//   const handleCameraCapture = async () => {
//     if (CameraView.current) {
//       try {
//         const photo = await CameraView.current.takePictureAsync();
//         setShowCamera(false);
//         if (photo.uri) {
//           setBackgroundImage(photo.uri);
//           await AsyncStorage.setItem('backgroundImage', photo.uri);
//         }
//       } catch (error) {
//         console.error('Error taking picture:', error);
//       }
//     }
//   };

//   const selectImage = async () => {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [16, 9],
//         quality: 1,
//       });

//       if (!result.canceled && result.assets && result.assets.length > 0) {
//         const uri = result.assets[0].uri;
//         setBackgroundImage(uri);
//         await AsyncStorage.setItem('backgroundImage', uri);
//       }
//     } catch (error) {
//       console.error('Error selecting image:', error);
//     }
//   };

 
//   const toggleCameraFacing = () => {
//     setFacing(current => (current === 'back' ? 'front' : 'back'));
//   };
//   return (
//     <View style={styles.container}>
//       {showCamera ? (
//         <CameraView
//           style={styles.camera}
//           type={facing}
//           ref={CameraView}
//         >
//           <View style={styles.buttonContainer}>
//             <TouchableOpacity style={styles.button} onPress={() => setShowCamera(false)}>
//               <Text style={styles.buttonText}>Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.button} onPress={handleCameraCapture}>
//               <Text style={styles.buttonText}>Take Photo</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
//               <Text style={styles.buttonText}>Flip Camera</Text>
//             </TouchableOpacity>
//           </View>
//         </CameraView>
//       ) : (
//         <>
//           <Image
//             source={backgroundImage ? { uri: backgroundImage } : {uri: "https://i.pinimg.com/564x/ee/e9/b1/eee9b1c75a2d43f5a0d32a212d1a565f.jpg"}}
//             style={styles.backgroundImage}
//           />
//           <View style={styles.buttonContainer}>
//             <TouchableOpacity style={styles.button} onPress={takePhoto}>
//               <Text style={styles.buttonText}>Take Photo</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.button} onPress={selectImage}>
//               <Text style={styles.buttonText}>Select from Gallery</Text>
//             </TouchableOpacity>
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//   },
//   camera: {
//     flex: 1,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     position: 'absolute',
//     bottom: 20,
//     left: 0,
//     right: 0,
//   },
//   button: {
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     padding: 15,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//   },
//   message: {
//     textAlign: 'center',
//     paddingBottom: 10,
//   },
// });

// export default BackgroundImageChanger;
