import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { Formik, FormikHelpers } from "formik";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Input, Button } from "@ui-kitten/components";
import * as Yup from "yup";
import { useColorScheme } from "@/hooks/useColorScheme";

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  username: Yup.string().required("Required"),
});

export default function RegisterScreen() {
  const { register } = useAuth();
  const colorScheme = useColorScheme();

  const toLogin = () => {
    router.push({
      pathname: "/(login-regi)/login",
    });
  };

  const handleRegister = async (
    values: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      username: string;
    },
    {
      setSubmitting,
      setErrors,
    }: FormikHelpers<{
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      username: string;
    }>
  ) => {
    const registerError = await register(
      values.email,
      values.password,
      values.firstName,
      values.lastName,
      values.username
    );
    setSubmitting(false);
    if (registerError) setErrors({ email: registerError });
    else router.push("/(tabs)");
  };

  return (
    <View style={[styles.container, {backgroundColor: colorScheme === "light" ? "white" : "#1a1b1e"}]}>
      <Text style={[styles.descText, {color: colorScheme === "light" ? "black" : "white"}]}>Enter the info below to get started</Text>
      <Formik
        initialValues={{
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          username: "",
        }}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}
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
              placeholder="First Name"
              autoCapitalize="words"
              onChangeText={handleChange("firstName")}
              onBlur={handleBlur("firstName")}
              value={values.firstName}
              size="large"
            />
            {touched.firstName && errors.firstName && (
              <Text style={styles.error}>{errors.firstName}</Text>
            )}
            <Input
              style={[styles.infoBox, {backgroundColor: colorScheme === "light" ? "white" : "#1a1b1e"}]}
              textStyle={{color: colorScheme === "light" ? "black" : "white"}}
              placeholder="Last Name"
              autoCapitalize="words"
              onChangeText={handleChange("lastName")}
              onBlur={handleBlur("lastName")}
              value={values.lastName}
              size="large"
            />
            {touched.lastName && errors.lastName && (
              <Text style={styles.error}>{errors.lastName}</Text>
            )}
            <Input
              style={[styles.infoBox, {backgroundColor: colorScheme === "light" ? "white" : "#1a1b1e"}]}
              textStyle={{color: colorScheme === "light" ? "black" : "white"}}
              placeholder="Username"
              autoCapitalize="none"
              onChangeText={handleChange("username")}
              onBlur={handleBlur("username")}
              value={values.username}
              size="large"
            />
            {touched.username && errors.username && (
              <Text style={styles.error}>{errors.username}</Text>
            )}
            <Input
              style={[styles.infoBox, {backgroundColor: colorScheme === "light" ? "white" : "#1a1b1e"}]}
              textStyle={{color: colorScheme === "light" ? "black" : "white"}}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              size="large"
            />
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}
            <Input
              style={[styles.infoBox, {backgroundColor: colorScheme === "light" ? "white" : "#1a1b1e"}]}
              textStyle={{color: colorScheme === "light" ? "black" : "white"}}
              placeholder="Password"
              secureTextEntry
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              size="large"
            />
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}
            <Button
              onPress={handleSubmit as any}
              style={styles.registerButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </>
        )}
      </Formik>
      <Text style={{ marginTop: 100, color: colorScheme === "light" ? "black" : "white" }}>
        Already have an account?{" "}
        <Text
          style={{ color: "maroon" }}
          onPress={() => {
            toLogin();
          }}
        >
          Log in
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
  descText: {
    fontSize: 20,
    marginBottom: 50,
    marginTop: 125,
  },
  registerButton: {
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
