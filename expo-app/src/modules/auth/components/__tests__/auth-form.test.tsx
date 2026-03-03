import { render, screen, userEvent, waitFor } from "@testing-library/react-native";
import { AuthForm } from "../auth-form";
import { useAuthStore } from "../../stores/auth.store";
import { authLoginApi } from "../../apis/auth-login.api";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock dependencies
vi.mock("expo-router", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  Link: ({ children }: any) => children,
}));

vi.mock("../../stores/auth.store", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("../../apis/auth-login.api", () => ({
  authLoginApi: vi.fn(),
}));

describe("AuthForm", () => {
  const mockLogin = vi.fn();
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue({ login: mockLogin });
    (authLoginApi as any).mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
    });
  });

  it("renders correctly", () => {
    render(<AuthForm />);
    expect(screen.getByText("Correo Electrónico")).toBeTruthy();
    expect(screen.getByText("Contraseña")).toBeTruthy();
    expect(screen.getByText("Ingresar")).toBeTruthy();
  });

  it("validates empty inputs", async () => {
    const user = userEvent.setup();
    render(<AuthForm />);

    await user.press(screen.getByText("Ingresar"));

    expect(await screen.findByText("Correo electrónico inválido")).toBeTruthy();
    expect(await screen.findByText("La contraseña debe tener al menos 6 caracteres")).toBeTruthy();
  });

  it("calls login api on valid submission", async () => {
    const user = userEvent.setup();
    render(<AuthForm />);

    // Fill form
    const emailInput = screen.getByPlaceholderText("ejemplo@correo.com");
    const passwordInput = screen.getByPlaceholderText("••••••");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    // Submit
    await user.press(screen.getByText("Ingresar"));

    await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith(
            { email: "test@example.com", password: "password123" },
            expect.any(Object)
        );
    });
  });
});
