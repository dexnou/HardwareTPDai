import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Modal } from 'react-native';
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
    
    const startScanning = () => {
        if (hasPermission) {
          setScanning(true);
        } else {
          alert('No se ha otorgado permiso para usar la cámara.');
        }
    };
    




}

export default escanearQR;
