// jest-setup.ts
import "react-native-gesture-handler/jestSetup";

// Silence Reanimated warnings
// @ts-ignore

jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");

  Reanimated.default.call = () => {};
  Reanimated.useSharedValue = () => ({ value: 0 });
  Reanimated.useAnimatedStyle = () => ({});
  Reanimated.useAnimatedGestureHandler = () => ({});
  Reanimated.useDerivedValue = () => ({});
  // eslint-disable-next-line react/display-name
  Reanimated.AnimatedComponent = () => null;
  Reanimated.useAnimatedReaction = () => ({});
  Reanimated.withTiming = () => ({});
  Reanimated.withSpring = () => ({});
  Reanimated.useReducedMotion = () => false;
  Reanimated.animatedHandleHeight = { get: () => 42 };

  return Reanimated;
});

jest.mock("@gorhom/bottom-sheet", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    __esModule: true,
    BottomSheetModalProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(View, null, children),
    BottomSheetView: View,
    BottomSheetModal: View,
    BottomSheetBackdrop: () => null,
  };
});
