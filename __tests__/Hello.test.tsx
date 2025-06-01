import { render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

describe("Sample Test", () => {
  it("renders text correctly", () => {
    const { getByText } = render(<Text>Hello</Text>);
    expect(getByText("Hello")).toBeTruthy();
  });
});
