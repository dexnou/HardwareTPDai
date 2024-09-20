import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Modal, SafeAreaView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { BarCodeScanner } from 'expo-barcode-scanner';

const escanearQR = () => {
    const [modal, setModal] = useState(false);
    const [escanear, setEscanear] = useState(false);
    const [dataEscaneada, setDataEscaneada] = useState('');
    const [tienePermiso, setTienePermiso] = useState(null);
  
    const equipo = ['Noah Rotbard', 'Amélie Torre Walsh', 'María Emilia Gayoso Martinez'];
    const qrData = JSON.stringify({ team: equipo });
    
    useEffect(() => {
        (async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setTienePermiso(status === 'granted');
        })();
    }, []);
    
    const handleBarCodeScanned = ({ data }) => {
        setEscanear(false);
        try {
          let parsedData;
          try {
            parsedData = JSON.parse(data);
          } catch {
            // Si no es JSON, tratamos data como texto plano
            parsedData = data;
          }

          if (typeof parsedData === 'object' && parsedData !== null) {
            // Es un objeto (probablemente JSON)
            if (Array.isArray(parsedData.team)) {
              // Formato esperado: { team: [...] }
              setDataEscaneada(parsedData.team.join(', '));
            } else {
              // Otro tipo de objeto JSON
              setDataEscaneada(JSON.stringify(parsedData, null, 2));
            }
          } else if (typeof parsedData === 'string') {
            // Es una cadena de texto
            setDataEscaneada(parsedData);
          } else {
            // Otro tipo de dato
            setDataEscaneada(String(parsedData));
          }
          
          setModal(true);
        } catch (error) {
          console.error('Error al procesar los datos del QR:', error);
          alert(`Error al procesar el QR. Contenido: ${data}`);
        }
    };
    
    const empezarEscanear = () => {
        if (tienePermiso) {
            setEscanear(true);
        } else {
          alert('No se ha otorgado permiso para usar la cámara. Por favor, concede los permisos en la configuración de tu dispositivo.');
        }
    };

    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Escanear QR</Text>
            <QRCode
            value={qrData}
            size={200}
            />
            <Text style={styles.teamMembers}>
            Integrantes: {equipo.join(', ')}
            </Text>
            <Button 
                title="Escanear QR de otra app" 
                onPress={empezarEscanear} 
                disabled={tienePermiso === false}
            />
            {tienePermiso === false && (
                <Text style={styles.warningText}>
                    No se ha otorgado permiso para usar la cámara. 
                    La función de escaneo no está disponible.
                </Text>
            )}
    
            <Modal
            animationType="slide"
            transparent={true}
            visible={modal}
            onRequestClose={() => setModal(false)}
            >
            <View style={styles.modalView}>
                <Text style={styles.modalText}>Contenido del QR escaneado:</Text>
                <Text>{dataEscaneada}</Text>
                <Button title="Cerrar" onPress={() => setModal(false)} />
            </View>
            </Modal>
    
            {escanear && (
            <View style={styles.scannerContainer}>
                <BarCodeScanner
                onBarCodeScanned={handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
                />
                <Button title="Cancelar" onPress={() => setEscanear(false)} />
            </View>
            )}
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    teamMembers: {
      marginTop: 20,
      marginBottom: 20,
      textAlign: 'center',
    },
    modalView: {
      marginTop: 50,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 40,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    scannerContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingBottom: 20,
    },
    warningText: {
      color: 'red',
      textAlign: 'center',
      marginTop: 10,
    },
});
  
export default escanearQR;