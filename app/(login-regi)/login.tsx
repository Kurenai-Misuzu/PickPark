import { supabase } from "@/data/supabase";
import { router } from "expo-router";
import { Formik, FormikHelpers } from "formik";
import React from "react";
import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const handleLogin = async (
  values: { email: string; password: string },
  {
    setSubmitting,
    setErrors,
  }: FormikHelpers<{ email: string; password: string }>
) => {
  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });
  setSubmitting(false);
  if (error) {
    setErrors({ email: error.message });
    return;
  }
  router.push("/(tabs)");
};

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
            <TextInput
              style={styles.infoBox}
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
            <TextInput
              style={styles.infoBox}
              placeholder="Password"
              secureTextEntry
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
            />
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}
            <View style={styles.loginButton}>
              <Button
                title={isSubmitting ? "Logging in..." : "Log In"}
                onPress={handleSubmit as any}
                color="#800000"
                disabled={isSubmitting}
              />
            </View>
          </>
        )}
      </Formik>
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
  error: { color: "red", marginBottom: 8 },
});
