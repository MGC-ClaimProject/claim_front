import { create } from "zustand";

interface User {
  id: number;
  email: string;
  is_active: boolean;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setAuth: (accessToken: string, user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("access_token"),
  user: JSON.parse(localStorage.getItem("user") || "null"),

  setAuth: (accessToken, user) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    set({ accessToken, user });
  },

  clearAuth: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    set({ accessToken: null, user: null });
  },
}));
