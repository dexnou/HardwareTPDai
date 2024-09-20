import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, TextInput, Text, Button, Alert, SafeAreaView } from 'react-native';

const NumeroEmergencia = () => {
    const [numEmergencia, setNumEmergencia] = useState('');

    const handleInputChange = async (text: string) => {
        const formateado =await adaptarNum(text);
        setNumEmergencia(formateado);
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
        <SafeAreaView style={style.general}>
            <Text>Número Telefónico de Emergencia</Text>
            <TextInput 
                keyboardType='numeric'
                placeholder='Escriba su número de teléfono'
                value={numEmergencia}
                maxLength={12}
                onChangeText={handleInputChange}
            />
            <Button title="Actualizar" onPress={modificarGuardado}/>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    general: {
        padding: '5%',
    }
});

export default NumeroEmergencia;