import { create } from "zustand";
import { auth } from "../api/axiosInstance"; // ✅ 인증 요청을 위해 auth 사용

interface User {
  id: number;
  email: string;
  user_name: string;
  phone: string;
  birth: string;

}

export interface Member {
  id: number;
  name: string;
  phone: string;
  birth: string;
  gender: string;
  relation: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  member: Member | null;
  setAuth: (accessToken: string, user: User) => void;
  clearAuth: () => void;
  fetchUser: () => Promise<void>;
  fetchMember: (memberId: number) => Promise<void>; // ✅ memberId 추가
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("access_token"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
  member: JSON.parse(localStorage.getItem("member") || "null"), // ✅ 멤버 정보 추가

  setAuth: (accessToken, user) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    set({ accessToken, user });
  },

  clearAuth: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("member"); // ✅ 로그아웃 시 멤버 정보도 삭제
    set({ accessToken: null, user: null, member: null });
  },

  fetchUser: async () => {
    try {
      const response = await auth.get("/user/3/");
      const userData = response.data;
      localStorage.setItem("user", JSON.stringify(userData));
      set({ user: userData });
    } catch (error) {
      console.error("❌ 사용자 정보 가져오기 실패:", error);
    }
  },

  fetchMember: async (memberId: number) => {
    try {
      const response = await auth.get(`/members/${memberId}/`); // ✅ 동적으로 memberId 사용
      const memberData = response.data;
      localStorage.setItem("member", JSON.stringify(memberData));
      set({ member: memberData });
    } catch (error) {
      console.error("❌ 멤버 정보 가져오기 실패:", error);
    }
  },
}));
