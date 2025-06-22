import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StyleSheet, View } from 'react-native';
import { Appearance } from "react-native";

export default function BlurTabBarBackground() {
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: Appearance.getColorScheme() === "light" ? "white" : "#121415" }]} />
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
