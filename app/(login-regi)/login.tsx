import React from "react";
import { Button, Image, StyleSheet, Text, View, TextInput } from 'react-native';
import { router } from 'expo-router';

export default function LoginScreen() {
    const loginUser = () => {
        router.push({
            pathname: '/(tabs)',
        })
    }

    return (
        <View style={styles.container}>
            <Image style={styles.pParkImage} source={require('@/assets/images/ParkingPin.png')} />
            <Text style={styles.titleText}>
                Welcome to PickPark
            </Text>
            <Text style={styles.descText}>
                Find the best parking near you
            </Text>
            <TextInput style={styles.infoBox} placeholder="Email" />
            <TextInput style={styles.infoBox} placeholder="Password" />
            <View style={styles.loginButton}>
                <Button 
                title="Log In (Logs in without auth)"
                onPress={() => {loginUser()}}
                color="#800000"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    pParkImage: {
        marginTop: 60,
        width: '60%',
        height: '50%',
    },
    titleText: {
        fontSize: 35,
        fontWeight: 'bold'
    },
    descText: {
        fontSize: 20,
        color: 'gray',
        marginBottom: 50,
    },
    loginButton: {
        width: '70%',
    },
    infoBox: {
        borderColor: 'maroon',
        borderWidth: 1,
        borderRadius: 3,
        width: '70%',
        marginBottom: 12,
    }
})