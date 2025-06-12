import { render } from "@testing-library/react-native";
import React from "react";
import ParkingCard from "./ParkingCard"; // Adjust path if needed

describe("ParkingCard", () => {
  it("renders name and address correctly", () => {
    const mockProps = {
      name: "Test Lot",
      address: "456 Main Ave",
    };

    const { getByText } = render(<ParkingCard {...mockProps} />);
    expect(getByText("Test Lot")).toBeTruthy();
    expect(getByText("456 Main Ave")).toBeTruthy();
  });
});
