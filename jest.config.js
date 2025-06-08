module.exports = {
  preset: "jest-expo",
  setupFiles: ["./jest-setup.ts"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native|react-clone-referenced-element|@expo|expo(nent)?|@expo-google-fonts|@react-navigation))",
  ],
  testEnvironment: "node",

  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
};
