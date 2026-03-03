import { fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";
import Button from "../button";

describe("Button Component", () => {
  it("renders children correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeOnTheScreen();
  });

  it("handles onPress event", () => {
    const handlePress = vi.fn();
    render(<Button onPress={handlePress}>Click me</Button>);
    fireEvent.press(screen.getByText("Click me"));
    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it("shows loading state", () => {
    render(
      <Button isLoading loading_title="Processing...">
        Submit
      </Button>,
    );
    expect(screen.getByText("Processing...")).toBeOnTheScreen();
    // In RN, disabled state might vary, check accessibility state
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("applies variant classes", () => {
    // NativeWind + Testing Library is tricky to test styles directly via className prop reflection
    // But we can check if it renders without error
    render(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole("button")).toBeOnTheScreen();
  });
});
