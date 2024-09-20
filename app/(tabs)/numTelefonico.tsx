import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, TextInput, Text, Button, Alert } from 'react-native';

const NumeroEmergencia = () => {
    const [numEmergencia, setNumEmergencia] = useState('');

    const handleInputChange = (text: string) => {
        const formateado = adaptarNum(text);
        return formateado;
    }

    const adaptarNum = (text: string) => {
        const limpio = text.replace(/\D/g, '');
        const formateado = limpio.match(/^(\d{2})(\d{0,4})(\d{0,4})$/);
        if(formateado){
            return `${formateado[1]}-${formateado[2]}${formateado[3] ? '-' + formateado[3] : ''}`;
        }
        return text;
    }

    const modificarGuardado = async () => {
        setNumEmergencia(numEmergencia)
        const alertMessage = 'El número telefónico de emergencia fue actualizado. Ahora es: ' + numEmergencia;
        await AsyncStorage.setItem('num', numEmergencia);
        Alert.alert('Actualización', alertMessage, [
        {
            text: "OK",
            onPress: () => {},
            style: 'destructive',
        },
    ])
    }

    return (
        <View>
            <Text>Número Telefónico de Emergencia</Text>
            <TextInput 
                keyboardType='numeric'
                placeholder='Escriba su número de teléfono'
                value={numEmergencia}
                onChangeText={handleInputChange}
            />
            <Button title="Actualizar" onPress={modificarGuardado}/>
        </View>
    )
}

export default NumeroEmergencia;