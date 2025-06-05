import React from "react";
import { Button, Image, StyleSheet, Text, View, TextInput } from 'react-native';
import { router } from 'expo-router';

export default function RegisterScreen() {
    const toLogin = () => {
        router.push({
            pathname: '/(login-regi)/login'
        })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.descText}>
                Enter the info below to get started
            </Text>
            <TextInput style={styles.infoBox} placeholder="First Name" />
            <TextInput style={styles.infoBox} placeholder="Last Name" />
            <TextInput style={styles.infoBox} placeholder="Email" />
            <TextInput style={styles.infoBox} placeholder="Password" />
            <TextInput style={styles.infoBox} placeholder="Confirm Password" />
            <View style={styles.loginButton}>
                <Button 
                title="Sign Up"
                color="maroon"
                />
            </View>
            <Text style={{marginTop: 100}}>
                Already have an account? <Text style={{color: 'maroon'}} onPress={() => {toLogin()}}>Log in</Text>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    descText: {
        fontSize: 20,
        marginBottom: 50,
        marginTop: 125,
    },
    loginButton: {
        width: '70%',
    },
    infoBox: {
        borderColor: 'maroon',
        borderWidth: 1,
        borderRadius: 3,
        width: '70%',
        marginBottom: 40,
        padding: 15,
    }
})