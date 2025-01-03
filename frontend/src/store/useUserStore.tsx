import { User } from "@/types/user";
import { create } from "zustand";

interface UserStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  getUser: () => User | null;
  updateUser: (user: User) => void;
  setIsLoading: (isLoading: boolean) => void;
  initializeUser: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isLoading: false,
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  getUser: () => get().user,
  updateUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  setIsLoading: (isLoading) => set({ isLoading }),
  initializeUser: () => {
    const user = localStorage.getItem("user");
    if (user) {
      set({ user: JSON.parse(user) });
    }
  },
}));
