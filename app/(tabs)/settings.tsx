import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/data/supabase";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

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

  const handleLogout = async () => {
    await logout();
    router.replace("/(login-regi)/login");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {profileLoading ? (
        <Text>Loading profile...</Text>
      ) : profile ? (
        <View style={{ marginBottom: 40 }}>
          <Text>Username: {profile.username}</Text>
          <Text>First Name: {profile.first_name}</Text>
          <Text>Last Name: {profile.last_name}</Text>
        </View>
      ) : (
        <Text>Profile not found.</Text>
      )}
      <View style={{ width: "70%" }}>
        <Button
          title={loading ? "Logging out..." : "Logout"}
          onPress={handleLogout}
          disabled={loading}
          color="#800000"
        />
      </View>
    </View>
  );
}
