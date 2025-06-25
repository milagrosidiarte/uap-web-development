import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "./useTasks"; // Asegurate que este path sea correcto
import { showToast } from "../utils/showToast";

type RegisterInput = {
  email: string;
  password: string;
};

export function useRegister() {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: async ({ email, password }: RegisterInput) => {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Importante si el backend setea cookies (aunque en register puede no ser necesario)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to register");
      }

      return response.json(); // Devuelve el nuevo usuario, o lo que el backend devuelva
    },
    onSuccess: () => {
      showToast("Registration successful!", "success");
    },
    onError: (error) => {
      showToast(`Registration failed: ${error.message}`, "error");
    },
  });
}
