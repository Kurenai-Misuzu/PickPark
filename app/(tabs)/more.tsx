import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { Button, View } from "react-native";

export default function MoreScreen() {
  const { logout, loading } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/(login-regi)/login");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
