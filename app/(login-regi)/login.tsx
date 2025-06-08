import { router } from "expo-router";
import React from "react";
import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const loginUser = () => {
    router.push({
      pathname: "/(tabs)",
    });
  };

  const toSignUp = () => {
    router.push({
      pathname: "/(login-regi)/register",
    });
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.pParkImage}
        source={require("@/assets/images/ParkingPin.png")}
      />
      <Text style={styles.titleText}>Welcome to PickPark</Text>
      <Text style={styles.descText}>Find the best parking near you</Text>
      <TextInput style={styles.infoBox} placeholder="Email" />
      <TextInput style={styles.infoBox} placeholder="Password" />
      <View style={styles.loginButton}>
        <Button
          title="Log In (Logs in without auth)"
          onPress={() => {
            loginUser();
          }}
          color="#800000"
        />
      </View>
      <Text style={{ marginTop: 30, color: "maroon" }}>Forgot Password?</Text>
      <Text style={{ marginTop: 20 }}>
        Don&apos;t have an account? {/* Don't have an account?{" "} */}
        <Text
          style={{ color: "maroon" }}
          onPress={() => {
            toSignUp();
          }}
        >
          Sign up
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  pParkImage: {
    marginTop: 50,
    width: "70%",
    height: "50%",
  },
  titleText: {
    fontSize: 35,
    fontWeight: "bold",
  },
  descText: {
    fontSize: 20,
    color: "gray",
    marginBottom: 50,
  },
  loginButton: {
    width: "70%",
  },
  infoBox: {
    borderColor: "maroon",
    borderWidth: 1,
    borderRadius: 3,
    width: "70%",
    marginBottom: 12,
    padding: 13,
  },
});
