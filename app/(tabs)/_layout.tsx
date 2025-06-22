import { Tabs } from "expo-router";
import React from "react";
import { Platform, View, Text } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const appTheme = Colors[colorScheme ?? "light"];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: appTheme.tabIconSelected,
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
          tabBarLabel: () => (
            <Text style={{ color: appTheme.text, fontSize: 14 }}>Search</Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            // Error in name is fine, due to not assinging all MaterialIcon variables in IconSymbol />
            focused ? (
              <View style={{
                backgroundColor: "#801818",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                minHeight: 30,
                minWidth: 50
              }}>
                <IconSymbol size={28} name="magnifyingglass" color={color} />
              </View>
            ) : (
              <View>
                <IconSymbol size={28} name="magnifyingglass" color={color} />
              </View>
            )
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarLabel: () => (
            <Text style={{ color: appTheme.text, fontSize: 14 }}>Favorites</Text>
          ),
          headerShown: true,
          headerTitleAlign: "center",
          tabBarIcon: ({ color, focused }) => (
            // Error in name is fine, due to not assinging all MaterialIcon variables in IconSymbol />
            focused ? (
              <View style={{
                backgroundColor: "#801818",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                minHeight: 30,
                minWidth: 50
              }}>
                <IconSymbol size={28} name="heart.fill" color={color} />
              </View>
            ) : (
              <View>
                <IconSymbol size={28} name="heart.fill" color={color} />
              </View>
            )
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarLabel: () => (
            <Text style={{ color: appTheme.text, fontSize: 14 }}>Settings</Text>
          ),
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: "Settings",
          tabBarIcon: ({ color, focused }) => (
            // Error in name is fine, due to not assinging all MaterialIcon variables in IconSymbol />
            focused ? (
              <View style={{
                backgroundColor: "#801818",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                minHeight: 30,
                minWidth: 50
              }}>
                <IconSymbol size={28} name="line.3.horizontal" color={color} />
              </View>
            ) : (
              <View>
                <IconSymbol size={28} name="line.3.horizontal" color={color} />
              </View>
            )
          ),
        }}
      />
    </Tabs>
  );
}
