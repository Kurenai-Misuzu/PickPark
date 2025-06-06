import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function TabLayout() {
  const queryClient = new QueryClient();
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Search",
            tabBarIcon: ({ color }) => (
              // Error in name is fine, due to not assinging all MaterialIcon variables in IconSymbol />
              <IconSymbol size={28} name="search.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: "Favorites",
            headerShown: true,
            headerTitleAlign: "center",
            tabBarIcon: ({ color }) => (
              // Error in name is fine, due to not assinging all MaterialIcon variables in IconSymbol />
              <IconSymbol size={28} name="favorite.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: "More",
            headerShown: true,
            headerTitleAlign: "center",
            headerTitle: "PickPark",
            tabBarIcon: ({ color }) => (
              // Error in name is fine, due to not assinging all MaterialIcon variables in IconSymbol />
              <IconSymbol size={28} name="menu.fill" color={color} />
            ),
          }}
        />
      </Tabs>
    </QueryClientProvider>
  );
}
