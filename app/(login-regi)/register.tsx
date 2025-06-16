import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { Formik, FormikHelpers } from "formik";
import React from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import * as Yup from "yup";

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
  const { register, loading, error } = useAuth();

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
    <View style={styles.container}>
      <Text style={styles.descText}>Enter the info below to get started</Text>
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
            <TextInput
              style={styles.infoBox}
              placeholder="First Name"
              autoCapitalize="words"
              onChangeText={handleChange("firstName")}
              onBlur={handleBlur("firstName")}
              value={values.firstName}
            />
            {touched.firstName && errors.firstName && (
              <Text style={styles.error}>{errors.firstName}</Text>
            )}
            <TextInput
              style={styles.infoBox}
              placeholder="Last Name"
              autoCapitalize="words"
              onChangeText={handleChange("lastName")}
              onBlur={handleBlur("lastName")}
              value={values.lastName}
            />
            {touched.lastName && errors.lastName && (
              <Text style={styles.error}>{errors.lastName}</Text>
            )}
            <TextInput
              style={styles.infoBox}
              placeholder="Username"
              autoCapitalize="none"
              onChangeText={handleChange("username")}
              onBlur={handleBlur("username")}
              value={values.username}
            />
            {touched.username && errors.username && (
              <Text style={styles.error}>{errors.username}</Text>
            )}
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
            <Button
              title={isSubmitting ? "Registering..." : "Register"}
              onPress={handleSubmit as any}
              color="#800000"
              disabled={isSubmitting}
            />
          </>
        )}
      </Formik>
      <Text style={{ marginTop: 100 }}>
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
  },
  descText: {
    fontSize: 20,
    marginBottom: 50,
    marginTop: 125,
  },
  loginButton: {
    width: "70%",
  },
  infoBox: {
    borderColor: "maroon",
    borderWidth: 1,
    borderRadius: 3,
    width: "70%",
    marginBottom: 40,
    padding: 15,
  },
  error: { color: "red", marginBottom: 8 },
});
