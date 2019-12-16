import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import io from 'socket.io-client';
import api from '../services/api';

import logo from '../assets/logo.png';
import dislike from '../assets/dislike.png';
import like from '../assets/like.png';
import itsamatch from '../assets/itsamatch.png';

export default function Main({navigation}) {
    const [users, setUsers] = useState([]);
    const [userMatch, setUserMach] = useState(null);
    const userId = navigation.getParam('user'); 

    useEffect(() => {

        async function loadUsers() {
            const response = await api.get("devs", {
                headers: {
                    userid: userId
                }
            });

            setUsers(response.data);
        }

        loadUsers();

    }, [userId]);

    useEffect(() => {
        const socket = io('http://192.168.0.13:8080', {
            query: {
                user: userId
            }
        });

        socket.on('match',dev => {
            setUserMach(dev);
        });
        
    },[userId]);

    async function handleLogout() {
        await AsyncStorage.clear('');
        navigation.navigate('Login');
    }

    async function handleDislike() {
        const [user, ...rest] = users;

        await api.post(`devs/${user._id}/deslikes`, null, {
            headers: {
                userid: userId
            }
        });

        setUsers(rest);
    }

    async function handleLike() {

        const [user, ...rest] = users;

        await api.post(`devs/${user._id}/likes`, null, {
            headers: {
                userid: userId
            }
        });

        setUsers(rest);
    }

    function handleCloseMatch () {
        setUserMach(null);
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Image source={logo} />
            </TouchableOpacity>
            <View style={styles.cardsContainer}>
                {
                    (users.length > 0) ? (users.map((user, index) => (
                        <View key={user._id} style={[styles.card, { zIndex: users.length - index }]}>
                            <Image source={{ uri: user.avatar }} style={styles.avatar} />
                            <View style={styles.footer}>
                                <Text style={styles.name}>{user.name}</Text>
                                <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                            </View>
                        </View>
                    ))) : (<View style={styles.empty}>
                            <Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>
                    </View>)
                }              
            </View>

            {users.length > 0 && (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        onPress={handleDislike}
                        style={styles.button}
                    >
                        <Image source={dislike}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleLike}
                        style={styles.button}
                    >
                        <Image source={like}></Image>
                    </TouchableOpacity>
                </View>
            )}
            
            {userMatch && (
                <View style={styles.matchContainer}>
                    <Image source={itsamatch}></Image>
                    <Image style={styles.matchAvatar} source={{ uri: userMatch.avatar }}></Image>
                    <Text style={styles.matchName}>{userMatch.name}</Text>
                    <Text style={styles.matchBio} numberOfLines={3}>{userMatch.bio}</Text>
                    <TouchableOpacity onPress={handleCloseMatch}>
                        <Text style={styles.matchClose}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 30,
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1
    },

    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,
        marginTop: 20
    },

    card: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: "hidden",
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },

    avatar: {
        flex: 1,
        height: 300
    },

    footer: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 15
    },

    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },

    bio: {
        fontSize: 14,
        color: '#999',
        lineHeight: 18,
        marginTop: 2

    },

    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: 20,
        marginBottom: 40
    },

    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2
        }
    },
    empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    emptyText: {
        color: '#666',
        fontWeight: 'bold',
        fontSize: 20
    },

    matchContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,.8)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30
    },

    matchAvatar: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 6,
        borderColor: '#fff',
        marginTop: 10
    },

    matchClose: {
        color: '#fff',
        textTransform: 'uppercase',
        marginTop: 20,
        fontWeight: 'bold'
    },

    matchName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10
    },

    matchBio: {
        fontSize: 14,
        color: '#fff',
        lineHeight: 20

    }
    
});