import { AuthGate } from "@/components/AuthGate";
import { Colors } from "@/constants/Colors";
import { AuthProvider } from "@/contexts/AuthContext";
import { FaveProvider } from "@/contexts/FaveContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as eva from "@eva-design/eva";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import "react-native-reanimated";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
          <AuthProvider>
            <AuthGate>
              <FaveProvider>
                <Stack>
                  <Stack.Screen
                    name="(login-regi)/login"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(login-regi)/register"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(misc)/review"
                    options={{ headerShown: false, title: "Reviews" }}
                  />
                  <Stack.Screen
                    name="(misc)/all-reviews"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
              </FaveProvider>
            </AuthGate>
          </AuthProvider>
        </ApplicationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
