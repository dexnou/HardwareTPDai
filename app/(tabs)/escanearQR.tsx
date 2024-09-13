import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Modal, SafeAreaView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { BarCodeScanner } from 'expo-barcode-scanner';

const escanearQR = () => {
    const [modal, setModal] = useState(false)
    const [escanear,setEscanear] = useState(false)
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
          const parsedData = JSON.parse(data);
          if (parsedData.team) {
            setDataEscaneada(parsedData.team.join(', '));
            setModal(true);
          } else {
            alert('QR inválido. No contiene información del equipo.');
          }
        } catch (error) {
          alert('Error al leer el QR. Formato inválido.');
        }
    };
    
    const empezarEscanear = () => {
        if (tienePermiso) {
            setEscanear(true);
        } else {
          alert('No se ha otorgado permiso para usar la cámara.');
        }
    };

    if (tienePermiso === null) {
        return <Text>Solicitando permiso de cámara</Text>;
    }
    if (tienePermiso === false) {
        return <Text>Sin acceso a la cámara</Text>;
    }
    
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
            <Button title="Escanear QR de otra app" onPress={empezarEscanear} />
    
            <Modal
            animationType="slide"
            transparent={true}
            visible={modal}
            onRequestClose={() => setModal(false)}
            >
            <View style={styles.modalView}>
                <Text style={styles.modalText}>Integrantes de la app escaneada:</Text>
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
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
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
});
  

export default escanearQR;
