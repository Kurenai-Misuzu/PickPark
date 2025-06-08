import { render, screen } from "@testing-library/react-native";
import React from "react";

import HomeScreen from "../app/(tabs)/index";

describe("HomeScreen", () => {
  it("renders Parking Place cards from test data", async () => {
    render(<HomeScreen />);
    screen.debug();
    const item = await screen.findByText("Parking Place 1"); // ✅ async-aware
    expect(item).toBeTruthy();
    // const { getByText } = render(
    //   <SafeAreaProvider>
    //     <HomeScreen />
    //   </SafeAreaProvider>,
    // );

    // Add more asserts if needed
    // expect(getByText("Parking Place 1")).toBeTruthy();
  });
});

// import { render, waitFor } from "@testing-library/react-native";
// import React from "react";
// import HomeScreen from "../app/(tabs)/index";

// describe("HomeScreen", () => {
//   it("renders Parking Place cards from test data", async () => {
//     const { getByText } = render(<HomeScreen />);

//     // These values come from testParkingData.json
//     await waitFor(() => {
//       expect(getByText("Parking Place 1")).toBeTruthy();
//       expect(getByText("Parking Place 2")).toBeTruthy();
//       expect(getByText("Parking Place 3")).toBeTruthy();
//     });
//   });
// });
