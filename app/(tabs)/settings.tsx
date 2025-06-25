import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/data/supabase";
import { router } from "expo-router";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Appearance } from "react-native";
import { Input, Button as KittenButton, Icon, IconElement, IconProps } from "@ui-kitten/components";
import * as Yup from "yup";
import { useColorScheme } from "@/hooks/useColorScheme";

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

  const colorScheme = useColorScheme();

  const moonIcon = (props: IconProps): IconElement => (
      <Icon {...props} name="moon" fill="white" />
  );

  const sunIcon = (props: IconProps): IconElement => (
      <Icon {...props} name="sun" fill="white" />
  );

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
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/(login-regi)/login");
  };

  const toggleTheme = () => {
    Appearance.setColorScheme(
      Appearance.getColorScheme() === "dark" ? "light" : "dark"
    )
  }

  if (profileLoading || !profile || !user) {
    return (
      <View style={styles.centered}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: colorScheme === "light" ? "white" : "#1a1b1e"}]}>
      <Text style={{fontSize: 30, marginBottom: 5, color: colorScheme === "light" ? "black" : "white"}}>Hello, {profile.first_name}</Text>
      <Text style={{fontSize: 20, marginBottom: 10, color: colorScheme === "light" ? "black" : "white"}}>Profile information</Text>
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
              style={[styles.input, {backgroundColor: colorScheme === "light" ? "white" : "#1a1b1e"}]}
              textStyle={{color: colorScheme === "light" ? "black" : "white"}}
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
              style={[styles.input, {backgroundColor: colorScheme === "light" ? "white" : "#1a1b1e"}]}
              textStyle={{color: colorScheme === "light" ? "black" : "white"}}
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
              style={[styles.input, {backgroundColor: colorScheme === "light" ? "white" : "#1a1b1e"}]}
              textStyle={{color: colorScheme === "light" ? "black" : "white"}}
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
              onPress={() => handleSubmit}
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
        <KittenButton 
          style={styles.themeButton} 
          onPress={toggleTheme} 
          disabled={loading}
          accessoryLeft={Appearance.getColorScheme() === "light" ? moonIcon : sunIcon}
          status="danger"
        >
          Change Theme
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
  form: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    marginBottom: 10,
    width: "70%",
    borderColor: "maroon"
  },
  button: {
    marginTop: 10,
    width: "70%",
  },
  themeButton: {
    marginTop: 50,
  }
});
