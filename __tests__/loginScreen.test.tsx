import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import LoginScreen from "../app/(login-regi)/login";
import { supabase } from "../data/supabase";

const mockPush = jest.fn();

// Mock router
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock Supabase
jest.mock("../data/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

describe("LoginScreen Supabase Auth", () => {
  test("logs in successfully and navigates", async () => {
    const mockPush = jest.fn();
    const email = "test@example.com";
    const password = "password123";

    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      error: null,
    });

    const { getByPlaceholderText, getByTestId } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("Email"), email);
    fireEvent.changeText(getByPlaceholderText("Password"), password);
    fireEvent.press(getByTestId("login-button"));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email,
        password,
      });

      expect(mockPush).toHaveBeenCalledWith("/tabs");
    });
  });

  it("shows error on failed login", async () => {
    const errorMessage = "Invalid credentials";
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      error: { message: errorMessage },
    });

    const { getByPlaceholderText, getByText } = render(
      <LoginScreen />,
    );

    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    fireEvent.press(getByText("Login-button"));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
  });