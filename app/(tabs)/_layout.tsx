import { Tabs } from "expo-router";
import React from "react";
import { Platform, View, Text } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Background } from "@react-navigation/elements";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        //tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarActiveTintColor: "white",
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
          tabBarLabel: ({ color }) => (
            <Text style={{ color: "black", fontSize: 14 }}>Search</Text>
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
          tabBarLabel: ({ color }) => (
            <Text style={{ color: "black", fontSize: 14 }}>Favorites</Text>
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
        name="more"
        options={{
          title: "More",
          tabBarLabel: ({ color }) => (
            <Text style={{ color: "black", fontSize: 14 }}>More</Text>
          ),
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: "PickPark",
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
