import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { Formik, FormikHelpers } from "formik";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Input, Icon, IconElement, IconProps, Button } from "@ui-kitten/components";
import * as Yup from "yup";
import { useColorScheme } from "@/hooks/useColorScheme";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

export default function LoginScreen() {
  const { login } = useAuth();
  const [hidePassword, setHidePassword] = useState(true);
  const colorScheme = useColorScheme();

  const eyeIcon = (props: IconProps): IconElement => (
    <Pressable onPress={() => setHidePassword(!hidePassword)}>
      <Icon {...props} name={hidePassword ? "eye" : "eye-off"} fill="maroon" />
    </Pressable>
  );

  const handleLogin = async (
    values: { email: string; password: string },
    {
      setSubmitting,
      setErrors,
    }: FormikHelpers<{ email: string; password: string }>
  ) => {
    const loginError = await login(values.email, values.password);
    setSubmitting(false);
    if (loginError) setErrors({ email: loginError });
    // else router.push("/(tabs)");
  };

  // DELETE THIS AND BUTTON BEFORE PRESENTATION!
  const loginAdmin = async () => {
    const loginError = await login("admin@admin.com", "password");
  };

  const toSignUp = () => {
    router.push({
      pathname: "/(login-regi)/register",
    });
  };

  return (
    <View style={[styles.container, {backgroundColor: colorScheme === "light" ? "white" : "#1a1b1e"}]}>
      <Image
        style={styles.pParkImage}
        source={require("@/assets/images/ParkingPin.png")}
      />
      <Text style={[styles.titleText, {color: colorScheme === "light" ? "black" : "white"}]}>Welcome to PickPark</Text>
      <Text style={[styles.descText, {color: colorScheme === "light" ? "black" : "gray"}]}>Find the best parking near you</Text>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <>
            <Input
              style={[styles.infoBox, {backgroundColor: colorScheme === "light" ? "white" : "#1a1b1e"}]}
              textStyle={{color: colorScheme === "light" ? "black" : "white"}}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
            />
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}
            <Input
              style={[styles.infoBox, {backgroundColor: colorScheme === "light" ? "white" : "#1a1b1e"}]}
              textStyle={{color: colorScheme === "light" ? "black" : "white"}}
              placeholder="Password"
              secureTextEntry={hidePassword}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              accessoryRight={eyeIcon}
            />
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}
            <View>
              <Button
                onPress={handleSubmit as any}
                style={styles.loginButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </Button>
            </View>
          </>
        )}
      </Formik>
      {/* TEMPORARY login button for easy access to app without authentication */}
      <View>
        <Button
          onPress={() => {
            loginAdmin();
          }}
          style={styles.loginButton}
        >
          Log In (as admin)
        </Button>
      </View>
      <Text style={{ marginTop: 20, color: "maroon" }}>Forgot Password?</Text>
      <Text style={{ marginTop: 20, color: colorScheme === "light" ? "black" : "white" }}>
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
    flex: 1,
  },
  pParkImage: {
    marginTop: 50,
    width: 275,
    height: 300,
  },
  titleText: {
    fontSize: 35,
    fontWeight: "bold",
  },
  descText: {
    fontSize: 20,
    color: "gray",
    marginBottom: 30,
  },
  loginButton: {
    width: 275,
    backgroundColor: "maroon",
    borderColor: "maroon",
    borderRadius: 10,
    marginTop: 20,
  },
  infoBox: {
    borderColor: "maroon",
    borderWidth: 1,
    borderRadius: 3,
    width: 275,
    marginBottom: 20,
  },
  error: { color: "red", marginBottom: 5 },
});
