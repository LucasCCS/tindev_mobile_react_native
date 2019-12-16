import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, Image, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';


import logo from '../assets/logo.png';

export default function Login({ navigation }) {
    const [user, setUser] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('userid')
            .then(user =>  {
                if(user) {
                    navigation.navigate('Main',{user})
                }
            })
    },[]);

    async function handleLogin() {
        const response = await api.post('/devs',{
            username: user
        });

        const { _id } = response.data;
        await AsyncStorage.setItem('userid',_id);

        navigation.navigate('Main', {user: _id});
    }

    return (
        <KeyboardAvoidingView 
        behavior="padding"
            enabled={Platform.OS === 'ios'}
        style={styles.container}
        >
            <Image source={logo}/>
            <TextInput 
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Digite seu usuário no Github"
                placeholderTextColor="#999"
                value={user}
                onChangeText={setUser}
                style={styles.input}
            />
            <TouchableOpacity 
                onPress={handleLogin}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30
    },

    input: {
        height: 46,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        marginTop: 20,
        borderRadius: 4,
        alignSelf: 'stretch',
        backgroundColor: '#fff',
        color: '#666'
    },

    button: {
        height: 46,
        marginTop: 10,
        backgroundColor: '#DF4723',
        borderRadius: 4,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center'
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
}) 