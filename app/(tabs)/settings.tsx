import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/data/supabase";
import { Input, Button as KittenButton } from "@ui-kitten/components";
import { router } from "expo-router";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Yup from "yup";

const SettingsSchema = Yup.object().shape({
  first_name: Yup.string().required("Required"),
  last_name: Yup.string().required("Required"),
  username: Yup.string().required("Required"),
});

export default function SettingsScreen() {
  const { logout, loading, user } = useAuth();
  const [profile, setProfile] = useState<{
    username: string;
    first_name: string;
    last_name: string;
  } | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setProfileLoading(true);
      const { data, error } = await supabase
        .from("User")
        .select("username, first_name, last_name")
        .eq("user_id", user.id)
        .single();
      if (!error && data) setProfile(data);
      setProfileLoading(false);
    };
    fetchProfile();
  }, [user]);

  type ProfileFormValues = {
    username: string;
    first_name: string;
    last_name: string;
  };

  const handleUpdate = async (
    values: ProfileFormValues,
    {
      setSubmitting,
      setStatus,
    }: { setSubmitting: (b: boolean) => void; setStatus: (s: any) => void }
  ) => {
    if (!user) {
      setStatus("User not found.");
      setSubmitting(false);
      return;
    }

    setStatus(null);

    // Update profile fields in User table
    const { error: profileError } = await supabase
      .from("User")
      .update({
        username: values.username,
        first_name: values.first_name,
        last_name: values.last_name,
      })
      .eq("user_id", user.id);

    setSubmitting(false);

    if (profileError) {
      setStatus(profileError.message);
    } else {
      setStatus("Profile updated!");
      // Optionally, refetch profile
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/(login-regi)/login");
  };

  if (profileLoading || !profile || !user) {
    return (
      <View style={styles.centered}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hello, {profile.first_name}</Text>
      <Text style={styles.subheader}>Profile information</Text>
      <Formik
        initialValues={{
          first_name: profile.first_name ?? "",
          last_name: profile.last_name ?? "",
          username: profile.username ?? "",
        }}
        validationSchema={SettingsSchema}
        onSubmit={handleUpdate}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
          status,
        }) => (
          <View style={styles.form}>
            <Input
              label="First Name"
              style={styles.input}
              onChangeText={handleChange("first_name")}
              onBlur={handleBlur("first_name")}
              value={values.first_name}
              status={
                touched.first_name && errors.first_name ? "danger" : "basic"
              }
              caption={
                touched.first_name && errors.first_name ? errors.first_name : ""
              }
            />
            <Input
              label="Last Name"
              style={styles.input}
              onChangeText={handleChange("last_name")}
              onBlur={handleBlur("last_name")}
              value={values.last_name}
              status={
                touched.last_name && errors.last_name ? "danger" : "basic"
              }
              caption={
                touched.last_name && errors.last_name ? errors.last_name : ""
              }
            />
            <Input
              label="Username"
              style={styles.input}
              autoCapitalize="none"
              onChangeText={handleChange("username")}
              onBlur={handleBlur("username")}
              value={values.username}
              status={touched.username && errors.username ? "danger" : "basic"}
              caption={
                touched.username && errors.username ? errors.username : ""
              }
            />
            {status && (
              <Text
                style={{
                  color: status === "Profile updated!" ? "green" : "red",
                  marginBottom: 10,
                  marginTop: 10,
                }}
              >
                {status}
              </Text>
            )}
            <KittenButton
              style={styles.button}
              onPress={handleSubmit}
              disabled={isSubmitting}
              status="danger"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </KittenButton>
          </View>
        )}
      </Formik>
      <View style={{ width: "70%", marginTop: 20 }}>
        <KittenButton onPress={handleLogout} disabled={loading} status="danger">
          {loading ? "Logging out..." : "Logout"}
        </KittenButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 30,
    marginBottom: 5,
  },
  subheader: {
    fontSize: 20,
    marginBottom: 10,
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    marginBottom: 10,
    width: "70%",
  },
  button: {
    marginTop: 10,
    width: "70%",
  },
});
