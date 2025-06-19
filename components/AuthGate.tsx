import { useAuth } from "@/contexts/AuthContext";
import { router, useSegments } from "expo-router";
import { useEffect } from "react";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const segments = useSegments() as string[];

  useEffect(() => {
    console.log("user:", user, "loading:", loading, "segments:", segments);
    if (loading) return; // Wait for auth check to finish

    // If user is not authenticated and not already on login/register, redirect to login
    if (!user && !segments.includes("(login-regi)")) {
      console.log("Redirecting to login");
      setTimeout(() => router.replace("/(login-regi)/login"), 0);
    }
    // If user is authenticated and on login/register, redirect to tabs
    if (user && segments.includes("(login-regi)")) {
      console.log("Redirecting to tabs");
      setTimeout(() => router.replace("/(tabs)"), 0);
    }
  }, [user, loading, segments]);

  // Loading spinner
  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }

  return <>{children}</>;
}
